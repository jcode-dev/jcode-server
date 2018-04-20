/*
 * rest endpoint の登録
 */
var jwt = require('jsonwebtoken');

//const keystone = require('keystone');
const model =require('../models/user'); // User model
var bCrypt = require('bcrypt-nodejs');

const toRes = require('./resource-router').toRes;
const addRoutes = require('./resource-router').addRoutes;

const sendEmail = require('./email');

const mailFooter = "ご不明な点がありましたら、以下までお問合せください。\n（このメールには、返信しないでください。）\n＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝\nNPO法人プログラミング教育研究所\nnpo@j-code.org\nHTTP://J-CODE.ORG\n";


// Generate an Access Token for the given User ID
function generateAccessToken(userId) {
  // How long will the token be valid for
  const expiresIn = '1 hour';
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

const secretNumber = '7878';

exports = module.exports = (function(model){
	return addRoutes([
		// 一覧
		['/', 'get', function(req, res) {
			var params = req.params;
			var body = req.body;
			console.log("get user:", params);
			model.find({}).exec(toRes(res));
		},true],
		// ログイン情報
		['/whoami', 'get', function(req, res) {
			console.log("login user!!:", req.user);
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
		},true],
		['/:_id/', 'get', function(req, res) {
			var params = req.params;
			console.log("get jwt:", params);
			model.findById(params._id, toRes(res));
		}],

		// メールアドレス確認用メールを送信
		['/sendemail', 'post', function(req, res) {
			var email = req.body.email;
			model.find({ email: email }, function(err, result) {
				console.log("result:",err, result);
				if (err) throw err;
				if (result && result.length) { // データがある
					return res.status(400).send("すでにメールがあるみたい");
				} else {
					sendEmail(req.body.email, 'プログラミング教育研究所からの確認メール', "ご登録ありがとうございます。\n以下の番号を入力してください。\n\n秘密の番号： 7878\n\nこのメールは、プログラミング教育研究所のホームページで、会員登録を行おうとしている人に送られます。\n" + mailFooter );
					res.status(200).send("OK");
				}
			});
		}],
		// 会員登録
		['/signup', 'post', function(req, res) {
			console.log("signup:", req.body);

			model.count({ email: req.body.email }, function (err, count){ 
				if(count>0){
					return res.status(501).send("エラー"); //document exists });
				}
				if (req.body.number === secretNumber) {
					console.log("new user!");
					var newUser = new model();
					newUser.email = req.body.email;
					newUser.name = req.body.name;
					newUser.password = req.body.password;
					newUser.role = req.body.password || 'VOLUNTEER';
					newUser.save(function(err){
						console.log("err:", err);
						res.status(200).send(newUser);
					});
				} else {
					//model.findOne({}).exec(toRes(res));
					res.status(501).send("エラー");
					//toRes(res);
					//model.create(req.body, toRes(res));
				}
			}); 
		}],
		// サインイン
		['/signin', 'post', function(req, res) {
			console.log("signin:", req.body);

			var email = req.body.email;
			var password = req.body.password;
			model.findOne({ email: email }).exec(function(err, result) {
			
				console.log("signin:", result);
				if (err || !result || !isValidPassword(password, result.password)) {
					return res.status(501).send("エラー");
				}
				var token = generateAccessToken(result._id);
				res.status(200).send(token);
			});
		}],

		['/', 'post', function(req, res) {
			console.log("create:", req.body);
			var params = req.params;
			var body = req.body;
			
			//email('koichii@live.jp', 'テストです', 'これはテストですよ');

			res.status(501).send("エラー");
			//toRes(res);
			//model.create(req.body, toRes(res));
		}],
		// delete
		['/:_id/', 'delete', function(req, res) {
			var params = req.params;
			console.log("delete:",params);
			model.findByIdAndRemove(params._id, toRes(res));
		},true],

	]);
})(model);

