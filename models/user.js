/*
db.counters.find()
db.counters.findOneAndUpdate({_id:"userNumber"},{$inc:{nextSeqNumber: 1}})
db.counters.findOneAndUpdate({_id:"userNumber"},{ $set:{nextSeqNumber: 1063}})

use kids2020
db.docs.createIndex( { number: 1 }, { unique: true, sparse: true } );
db.docs.createIndex( { email: 1 }, { unique: true, sparse: true } );

*/
// イベント登録
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Doc = require('./doc');

var bCrypt = require('bcrypt-nodejs');

var User = Doc.discriminator('User',
	new Schema({
		number: {
			type: Number, unique: true, sparse: true
		},	// 番号
		mainrole: String, // PARENT, STUDENT, STAFF
		grade: String,	// 小1～中1
		furigana: String,
		fullname: String,
		password: String,	// サインイン・パスワード
		email: {
			type: String, unique: true, sparse: true
		},	// 番号
		zipcode: String,
		address1: String,
		address2: String,
		tel: String,
		
		hadInsurance: Boolean, // 別途保険をもってる
		memo: String,
		
		autho: String, //アクセス権限 ['GUEST', 'USER', 'ADMIN', 'ROOT']

		cdosection: String,
		cdopassword: String,
		microbitLending: String,
		insurance2018: Boolean,
	}));

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

// 連番を振る
var counterSchema = new Schema({
	"_id": { "type": String, "required": true },
  nextSeqNumber: { type: Number, default: 1000 }
});
var counter = mongoose.model('counter', counterSchema);

var settings_id = "userNumber";

counter.findById(settings_id, function (err, settings) {
	if (err) next(err);
	if (!settings) {
		console.log("insert");
		counter.create({_id: settings_id, nextSeqNumber: 1000 });
	}
});


// Create a compound unique index over _userId and document number
// Document.index({ "_userId": 1, "number": 1 }, { unique: true });

// I make sure this is the last pre-save middleware (just in case)
User.schema.pre('save', function(next) {
	var user = this;
	if (user.number) return next();

	// You have to know the settings_id, for me, I store it in memory: app.current.settings.id
	counter.findByIdAndUpdate( settings_id, { $inc: { nextSeqNumber: 1 } }, function (err, counter) { // return the original, インクリメントする前の数が返る
		if (err) next(err);
		user.number = counter.nextSeqNumber; 
		if (user.number == 1000) {
			user.autho = 'ROOT'; // 最初の人が管理者
		}
		next();
	});
});

module.exports = User;
