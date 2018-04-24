/*
 * rest endpoint の登録
 */
var jwt = require('jsonwebtoken');

//const keystone = require('keystone');
const model =require('../models/user'); // User model
var bCrypt = require('bcrypt-nodejs');

const toRes = require('./resource-router').toRes;
const addRoutes = require('./resource-router').addRoutes;

const mailer =require('./email/mailer');
const path = require('path');
const restapi =require('./restapi');

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

exports = module.exports = addRoutes([

	// ログイン情報
	['/whoami', 'get', function(req, res) {
		console.log("WHO AM I !!:", req.user);
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
	// 子どもの一覧
	['/children', 'get', function(req, res) {
		console.log("children:", req.user);
		if (req.user) {
			model.find({ownerId: req.user._id}).exec(toRes(res));
		}
	},true],
	// パスワードリセットして、確認用メールを送信(公開API)
	['/reset', 'post', function(req, res) {
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
	}, restapi.role.public],
	// 会員登録(公開API)
	['/signup', 'post', function(req, res) {
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
				console.log("err:", err);
				res.status(200).send(newUser);
			});
		}); 
	}, restapi.role.public],
	// サインイン(公開API)
	['/signin', 'post', function(req, res) {
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
	}, restapi.role.public],
	restapi.find(model),
	restapi.schema(model),
	restapi.create(model),
	restapi.read(model),
	restapi.update(model),
	restapi.remove(model),

]);
