var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var bCrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
	name: String,	// ニックネーム
	password: String,	// サインイン・パスワード
	email:String,		// email
	member_id: Number,	// 会員番号
	title: String,	//肩書 ['Student', 'Parent', 'Teacher', 'Staff', 'Administrator']
	role: String, //セキュリティ名 ['GUEST', 'USER', 'ADMIN', 'ROOT']
});
UserSchema.plugin(findOrCreate);
var User = mongoose.model('User', UserSchema);

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

UserSchema.pre('save', function(next) {
	var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// hash the password using our new salt
	var hash = bCrypt.hashSync(user.password);
	user.password = hash;
	next();
});

module.exports = User;
