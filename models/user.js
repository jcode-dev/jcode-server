// イベント登録
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Doc = require('./doc');

var bCrypt = require('bcrypt-nodejs');

var User = Doc.discriminator('User',
	new Schema({
		password: String,	// サインイン・パスワード
		email:String,		// email
		role: String, //セキュリティ名 ['GUEST', 'USER', 'ADMIN', 'ROOT']
	}));

// スキーマ毎に連番を振る
User.schema.pre('save', function(next) {
	var user = this;

	if (user.number) {
		return next();
	}
	User.find().sort({'number':-1}).exec(function(err,data){
		//console.log('number',data[0]);
		if (data[0] && data[0].number) {
			user.number = data[0].number+1;
		} else {
			user.number = 1000;
			user.role = 'ROOT';
		}
		return next();
	});
});

// パスワードは暗号化する
User.schema.pre('save', function(next) {
	var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// hash the password using our new salt
	var hash = bCrypt.hashSync(user.password);
	user.password = hash;
	next();
});

module.exports = User;
