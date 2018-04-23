// �C�x���g�o�^
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Doc = require('./doc');


var Child = new Schema({
	name: String,
	grade: String,
});

// �{�����e�B�A�A�܂��͎q�ǂ��������ɎQ��������\��
module.exports = Doc.discriminator('Registration',
	new Schema({
		eventId: ObjectId,
		furigana: String,
		fullname: String,
		email: String,
		tel: String,
		children:[Child],
	}));

