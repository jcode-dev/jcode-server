// 生徒サーベイ 01
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Doc = require('./doc');

module.exports = Doc.discriminator('students01',
	new Schema({
		grade: String,	// 小1～中1
		q_fun: Number,
		q_brain: Number,
		q_teacher: Number,
		q_again: Number,
		memo: String,
	})
);
