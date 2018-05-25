'use strict';
const passport = require('passport');
const addRoutes = require('./resource-router').addRoutes;

const bCrypt = require('bcrypt-nodejs');
const mailer =require('./email/mailer');
const path = require('path');
const jwt = require('jsonwebtoken');


// パスワードが一致しているかのチェック
var isValidPassword = function(password, hash){
	var result = false;

	try {
		result = bCrypt.compareSync(password, hash);
		console.log("OK:",result);
	} catch (e) {
		result = false;
	}
	return result;
}

// ユーザーIDを使ったアクセストークンの発行
function generateAccessToken(userId) {
  // How long will the token be valid for
  const expiresIn = '12 hour';
  const issuer = process.env.JWT_ISSUER;
  const audience = process.env.JWT_AUDIENCE;
  const secret = process.env.JWT_SECRET;

  const token = jwt.sign({}, secret, {
    expiresIn: expiresIn,
    audience: audience,
    issuer: issuer,
    subject: userId.toString()
  });

  return token;
}

// レスポンス
var toRes = function (res, status=200) {
	return (err, thing) => {
		if (err) {
			console.log("err:", err);
			return res.status(500).send(err);
		}
		if (thing && typeof thing.toObject==='function') {
			thing = thing.toObject();
		}
    res.set('X-Total-Count', 50);
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    
		res.status(status).send(thing);

	};
}

// パスポートのチェック
function authJwt() {
	return passport.authenticate(['jwt'], { session: false });
}
// ROOT権限ある？
function isRoot(user) {
	if (user && user.autho === restapi.autho.root) {
		return true;
	}
	return false;
}

// APIの定義
var restapi = {};

restapi.find = function(model, schema) {
	return ['/', 'get', function(req, res) {
		var params = req.query;
		console.log("find id:", req.user._id);
		var find =isRoot(req.user) ? {} : {ownerId: req.user._id};
		model.find(find).exec(toRes(res));
	}];
}

restapi.find2 = function(model, schema) {
	return ['/', 'get', function(req, res) {
		var params = req.query;
		console.log("find:", model.modelName, params);
		console.log("find id:", req.user._id);
		//console.dir();
		var limit = Math.max(1, Math.min(50, params.limit|0 || 100));

		// if you have fulltext search enabled.
		if (params.search && typeof model.textSearch==='function') {
			return model.textSearch(params.search, {
				limit : limit,
				language : 'en',
				lean : true
			}, toRes(res));
		}
		var find =isRoot(req.user) ? {} : {ownerId: req.user._id};
		model.find(find).skip(params.start|0 || 0).limit(limit).exec(toRes(res));
	}];
}

// セキュリティに注意（eventのみで使用）
// /api/event/?sort=-startDatetime
restapi.findPublic = function(router, model) {

	router.get('/', function(req, res) {
		var sort = req.query.sort; // ソート項目
		console.log("findPub:", model.modelName, sort);
		model.find().sort(sort).exec(toRes(res));
	})
}

// READ 一般
restapi.read = function(router, model, schema = '_id name') {
	router.get('/:_id/', authJwt(), function(req, res) {
		if (isRoot(req.user)) {
			console.log("readROOT", req.params['_id']);
			model.findById(req.params['_id']).exec(toRes(res));
		} else {
			console.log("read", req.params['_id']);
			model.findOne({_id: req.params['_id'], ownerId: req.user._id}, schema).exec(toRes(res));
		}
	});
}
// READ PUBLIC
restapi.readPublic = function(router, model) {
	router.get('/:_id/', function(req, res) {
		console.log("readPublic:", model.modelName);
		model.findById(req.params['_id']).exec(toRes(res));
	})
}

function getFields(body, fields) {
	var arr = fields.split(' ');
	var newf = {};
	for (let key of arr) {
		if (key in body) {
			newf[key] = body[key];
		}
	}
	return newf;
}

// 参加申込の検索
restapi.findJoin = function(router, model) {
	router.get('/', authJwt(), function(req, res) {
		var params = req.query;
		var find =isRoot(req.user) ? {} : {ownerId: req.user._id};
		if (params.gid) {
			find.groupId = params.gid;
		}
		console.log("findJoin:", model.modelName, find);

		if (isRoot(req.user)) {
			model.find(find).populate('memberId').exec(toRes(res));
		} else {
			model.find(find).populate('memberId').exec(toRes(res));
		}
	})
}

// 参加申込
restapi.createJoin = function(router, model) {
	router.post('/', authJwt(), function(req, res) {
		var body = req.body;
		body.ownerId = req.user._id; // created by
		body.status = 'PENDING';
		model.findOne({memberId:body.memberId, groupId:body.groupId},function(err, result) {
			if (err || result) {
				console.log(result);
				return res.status(401).send("エラー：申込は既に行われているようです。");
			} else {
				model.create(body, toRes(res));
			}
		});
	})
}

// 参加取消
restapi.removeJoin = function(router, model) {
	router.delete('/:_id/', authJwt(), function(req, res) {
		var id = req.params['_id'];
		console.log("delete:", model.modelName, id);
		if (isRoot(req.user)) {
			model.findByIdAndRemove(id, toRes(res));
		} else {
			model.findOne({_id: req.params['_id'], ownerId: req.user._id}, function(err, result) {
				if (result.status === 'PENDING') {
					model.findOneAndRemove({_id: req.params['_id'], ownerId: req.user._id}, toRes(res));
				} else if (result.status === 'APPROVED') {
					result.status = 'CANCEL';
					result.save( function(err){
						res.status(200).send(err);
					});
				} else {
					res.status(401).send("エラー");
				}
			});
		}
	})
}
// 応募者数の更新
restapi.eventStatusUpdate = function(router, event, join) {
	router.get('/statusupdate/:_id/', authJwt(), function(req, res) {
		console.log("statusupdate");

		var id = req.params['_id'];
		event.findOne({_id: id}, function(err, result) {
		console.log("aggregate", id);

			join.find({groupId: id}, function (err, joins) {
				var role = {};
				role['STUDENT'] = 0;
				role['STAFF'] = 0;
				for (var j of joins) {
					if (j.mainrole in role) {
						role[j.mainrole]++;
					}
				}
				console.log(role['STUDENT'], role['STAFF']);
				result.studentApplicant = role['STUDENT'];
				result.staffApplicant = role['STAFF'];
				result.save(function(err){
					res.status(200).send(err);
				});
			});
		});
	});
}

// アンケート一覧
restapi.listSurvey = function(router, model) {
	router.get('/list/:_id/', authJwt(), function(req, res) {
		console.log("listSurvey", req.params['_id']);
		if (! isRoot(req.user)) {
			return res.status(401).send("エラー：データを読み出せません");
		}
		//model.find({groupId:req.params['_id']}, toRes(res));
		model.find({groupId:req.params['_id']}).populate('memberId').exec(toRes(res));
	});
}
// アンケート読込 :id=GroupId
restapi.readSurvey = function(router, model) {
	router.get('/:_id/', authJwt(), function(req, res) {
		console.log("readSurvey", req.params['_id']);
		model.findOne({ownerId:req.user._id, groupId:req.params['_id']},function(err, result) {
			if (err || !result) {
				return res.status(401).send("エラー：データを読み出せません");
			} else {
				return res.status(200).send(result);
			}
		});
	});
}
// アンケート書込、更新 :body.groupId=GroupId
restapi.updateSurvey = function(router, model) {
	router.post('/', authJwt(), function(req, res) {
		console.log("updateSurvey", req.body);
		req.body.ownerId = req.user._id;
		req.body.memberId = req.user._id;
		delete req.body.__v;
		delete req.body.createdAt;
		model.findOneAndUpdate({ownerId:req.body.ownerId, groupId:req.body.groupId}, { $set:req.body }, {upsert: true, returnNewDocument: true}, function(err, result) {
			if (err) {
				console.log(err);
				return res.status(401).send("エラー：データを読み出せません");
			} else {
				console.log(result);
				return res.status(200).send(result);
			}
		});
		//console.log(r);
		//return res.status(200).send("OK");
	})
}

restapi.schema = function(model, schema = {}) {
	return ['/schema', 'get', function(req, res) {
		console.log("schema user.autho:", req.user.autho);
		if (isRoot(req.user)) {
			res.status(200).send(model.schema.paths);
		} else {
			console.log(schema);
			res.status(200).send(schema);
		}
	}];
}

restapi.create = function(model, schema = null) {
	return ['/', 'post', function(req, res) {
		var body = req.body;
		body.ownerId = req.user._id; // created by
		console.log("create:", model.modelName, body);
		model.create(body, toRes(res));
	}];
}

restapi.update = function(model, fields = 'name') {
	return ['/:_id/', 'post', function(req, res) {
		console.log("UPDATE!!!!!");
		var id = req.params['_id'];
		var updateFields = getFields(req.body, fields);
		console.log("update:", model.modelName, id, updateFields);
		if (isRoot(req.user)) {
			model.findByIdAndUpdate(id, { $set:updateFields }, toRes(res));
		} else {
			model.findOneAndUpdate({_id: req.params['_id'], ownerId: req.user._id}, { $set:updateFields }, toRes(res));
		}
	}];
}

restapi.remove = function(model) {
	return ['/:_id/', 'delete', function(req, res) {
			var id = req.params['_id'];
			console.log("delete:", model.modelName, id);
			if (isRoot(req.user)) {
				model.findByIdAndRemove(id, toRes(res));
			} else {
				model.findOneAndRemove({_id: req.params['_id'], ownerId: req.user._id}, toRes(res));
			}
		},true];
}

restapi.autho = {
	public: 'PUBLIC',
	guest:  'GUEST',
	user:   'USER',
	admin:  'ADMIN',
	root:   'ROOT',
};

	// ユーザー拡張

// 子どもの一覧
restapi.children = function(model) {
	return ['/children', 'get', function(req, res) {
		console.log("children:", req.user);
		if (req.user) {
			model.find({ownerId: req.user._id}).exec(toRes(res));
		}
	},true];
}
// パスワードリセットして、確認用メールを送信(公開API)
restapi.reset = function(model) {
	return ['/reset', 'post', function(req, res) {
		var email = req.body.email;
		model.find({ email: email }, function(err, result) {
			console.log("reset:",result);
			//if (err || !result || result.length != 1 || req.body.password != "7878") {
			if (err || !result || result.length != 1 || req.body.password != 7878) {
				 return res.status(401).send("エラー：このメールアドレスには送信できません。");
			}
			var id = result[0]._id;
			var password = "7" + Math.ceil(Math.random()*100000);
			mailer(email, 'パスワードリセットのお知らせ',
			 path.join(__dirname, "./resetpass.txt"), {subject:'パスワードリセットのお知らせ', password: password});
			 model.findById(id, function (err, user) {
			  if (err) return res.status(401).send("エラー");
			  user.set({ password: password });
			  user.save(function (err, updatedUser) {
			    if (err) return res.status(401).send("エラー");
			    res.status(200).send("OK");
			  });
			});
		});
	}, restapi.autho.public];
}

// メール送信
restapi.sendemail = function(router) {
	router.post('/', authJwt(), function(req, res) {
		var email = req.user.email;
		var msg = req.body;

		mailer(email, msg.title,
		 path.join(__dirname, "./emailtemplate.txt"), {subject:msg.title, body: msg.body});

		res.status(200).send("OK");
	});
}

// パスワード変更 toDO : bug fix 子どものパスワードを変更できるように

restapi.password = function(router, model) {
	router.post('/password/:_id/', authJwt(), function(req, res) {
		console.log("password:", req.body);
		var find;
		if (isRoot(req.user)) {
			find = {_id: req.params['_id']};
		} else {
			find = {_id: req.params['_id'], ownerId: req.user._id};
		}
		model.findOne(find, function (err, user) {
			if (err) return res.status(401).send("エラー");
			user.set({ password: req.body.password });
			user.save(function (err, updatedUser) {
			  if (err) return res.status(401).send("エラー");
			  res.status(200).send("OK");
			});
		});
	});
}



// ユーザー登録(公開API)
restapi.signup = function(model) {
	return ['/signup', 'post', function(req, res) {
		console.log("signup:", req.body);

		model.count({ email: req.body.email }, function (err, count){ 
			if(count>0){
				return res.status(401).send("エラー：このメールアドレスは既に登録されている可能性があります。");
			}
			console.log("new user!");
			var newUser = new model();
			newUser.email = req.body.email;
			newUser.name = req.body.name;
			newUser.password = req.body.password;
			newUser.autho = 'GUEST';
			newUser.save(function(err){
				if (err) {return res.status(401).send("エラー")};
				console.log("new:", newUser);
				model.findByIdAndUpdate(newUser._id, {ownerId: newUser._id}, function(err){
					var token = generateAccessToken(newUser._id);
					res.status(200).send(token);
				});
			});
		}); 
	}, restapi.autho.public];
}
// サインイン(公開API)
restapi.signin = function(model) {
	return ['/signin', 'post', function(req, res) {
		console.log("signin:", req.body);

		var email = req.body.email;
		var password = req.body.password;
		model.findOne({ email: email }).exec(function(err, result) {
		
			console.log("signin:", result);
			if (err || !result || !isValidPassword(password, result.password)) {
				return res.status(401).send("エラー：メールアドレスとパスワードが異なる可能性があります。");
			}
			var token = generateAccessToken(result._id);
			res.status(200).send(token);
		});
	}, restapi.autho.public];
}

// 会員番号でサインイン(公開API)
restapi.nsignin = function(model) {
	return ['/nsignin', 'post', function(req, res) {
		console.log("nsignin:", req.body);

		var number = req.body.number;
		var password = req.body.password;
		model.findOne({ number: number }).exec(function(err, result) {
		
			console.log("signin:", result);
			if (err || !result || !isValidPassword(password, result.password)) {
				return res.status(401).send("エラー：メールアドレスとパスワードが異なる可能性があります。");
			}
			var token = generateAccessToken(result._id);
			res.status(200).send(token);
		});
	}, restapi.autho.public];
}

// サインイン(管理者用)
restapi.signinAdmin = function(router, model) {
	router.post('/signinadmin', authJwt(), function(req, res) {
		var email = req.body.email;
		console.log("signinadmin:", email);
		if (isRoot(req.user)) {
			model.findOne({ email: email }).exec(function(err, result) {
				if (err || !result) {
					return res.status(401).send("エラー：メールアドレスとパスワードが異なる可能性があります。");
				}
				var token = generateAccessToken(result._id);
				res.status(200).send(token);
			});
		}
	})
}

// ログイン情報
restapi.whoami = function(router, model, fields = '_id name') {
	router.get('/whoami', authJwt(), function(req, res) {
		console.log("whoami:", req.user, fields);
		var updateFields = getFields(req.user, fields);
		console.log("whoami2:", updateFields);
		res.status(200).send(updateFields);
	});
}

exports = module.exports = restapi;
