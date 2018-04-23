// イベント登録
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Doc = require('./doc');


var Child = new Schema({
	name: String,
	grade: String,
});

// ボランティア、または子どもを教室に参加させる申込
module.exports = Doc.discriminator('Registration',
	new Schema({
		eventId: ObjectId,
		furigana: String,
		fullname: String,
		email: String,
		tel: String,
		children:[Child],
	}));

