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
		member_id: Number,	// 会員番号
		role: String, //セキュリティ名 ['GUEST', 'USER', 'ADMIN', 'ROOT']
	}));

// Auto Increment Membership ID
User.schema.pre('save', function(next) {
	var user = this;

	if (user.member_id) {
		return next();
	}
	User.find().sort({'member_id':-1}).exec(function(err,data){
		console.log('number',data[0]);
		if (data[0] && data[0].member_id) {
			user.member_id = data[0].member_id+1;
			//console.log('member_id1:',user.member_id);
		} else {
			user.member_id = 1000;
			user.role = 'ROOT';
			//console.log('member_id2:',user.member_id);
		}
		return next();
	});
});

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
