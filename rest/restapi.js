'use strict';
const passport = require('passport');
const addRoutes = require('./resource-router').addRoutes;

const bCrypt = require('bcrypt-nodejs');
const mailer =require('./email/mailer');
const path = require('path');
const jwt = require('jsonwebtoken');


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

// Generate an Access Token for the given User ID
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


var restapi = {};

restapi.find = function(model, schema) {
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

restapi.findPublic = function(router, model) {
	router.get('/', function(req, res) {
		var params = req.query;
		console.log("findPub:", model.modelName, params);
		model.find().exec(toRes(res));
	})
}

function isRoot(user) {
	if (user && user.role === restapi.role.root) {
		return true;
	}
	return false;
}

restapi.schema = function(model, schema = {}) {
	return ['/schema', 'get', function(req, res) {
		console.log("schema user.role:", req.user.role);
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

restapi.read = function(model, schema = 'name') {
	return ['/:_id/', 'get', function(req, res) {
		console.log(schema);
		if (isRoot(req.user)) {
			model.findById(req.params['_id']).exec(toRes(res));
		} else {
			console.log("user read:",schema);
			model.findOne({_id: req.params['_id'], ownerId: req.user._id}, schema).exec(toRes(res));
		}
	}, false];
}
restapi.readPublic = function(router, model) {
	router.get('/:_id/', function(req, res) {
		model.findById(req.params['_id']).exec(toRes(res));
	})
}

restapi.update = function(model) {
	return ['/:_id/', 'post', function(req, res) {
		console.log("UPDATE!!!!!");
		var id = req.params['_id'];
		var body = req.body;
		delete body._id;
		delete body.updatedAt;
		delete body.createdAt;
		console.log("update:", model.modelName, id, body);
		if (isRoot(req.user)) {
			model.findByIdAndUpdate(id, { $set:body }, toRes(res));
		} else {
			model.findOneAndUpdate({_id: req.params['_id'], ownerId: req.user._id}, { $set:body }, toRes(res));
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

restapi.role = {
	public: 'PUBLIC',
	guest:  'GUEST',
	user:   'USER',
	admin:  'ADMIN',
	root:   'ROOT',
};

	// ユーザー拡張

// ログイン情報
restapi.whoami = function(model, schema = null) {
	return ['/whoami', 'get', function(req, res) {
		console.log("who am I ?:", req.user);
		var user = null;
		if (req.user) {
			user = {
				_id: req.user.id,
				name: req.user.name,
				email: req.user.email,
				member_id: req.user.member_id,
				role: req.user.role,
				title: req.user.title,
			}
		}
		res.status(200).send(user);
	},true];
}
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
			var password = "78" + Math.ceil(Math.random()*10000);
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
	}, restapi.role.public];
}
// パスワード変更 toDO : bug fix 子どものパスワードを変更できるように
restapi.password = function(model) {
	return ['/password', 'post', function(req, res) {
		console.log("password:", req.body);

		model.findById(req.user._id, function (err, user) {
			if (err) return res.status(401).send("エラー");
			user.set({ password: req.body.password });
			user.save(function (err, updatedUser) {
			  if (err) return res.status(401).send("エラー");
			  res.status(200).send("OK");
			});
		});
	}];
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
			newUser.role = 'GUEST';
			newUser.save(function(err){
				console.log("new:", newUser);
				newUser.ownerId = newUser._id;
				newUser.save(function(err){
					res.status(200).send(newUser);
				});
			});
		}); 
	}, restapi.role.public];
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
	}, restapi.role.public];
}

exports = module.exports = restapi;
