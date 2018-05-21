// イベント登録
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Doc = require('./doc');

var bCrypt = require('bcrypt-nodejs');

var User = Doc.discriminator('User',
	new Schema({
		number: Number,	// 番号
		mainrole: String, // PARENT, STUDENT, STAFF
		grade: String,	// 小1～中1
		furigana: String,
		fullname: String,
		password: String,	// サインイン・パスワード
		email:String,		// email
		
		zipcode: String,
		address1: String,
		address2: String,
		tel: String,
		
		hadInsurance: Boolean, // 別途保険をもってる
		memo: String,
		
		autho: String, //アクセス権限 ['GUEST', 'USER', 'ADMIN', 'ROOT']

		cdosection: String,
		cdopassword: String,

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
			user.autho = 'ROOT';
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
