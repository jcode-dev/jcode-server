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
var EventRegistration = Doc.discriminator('EventRegistration',
	new Schema({
		eventId: ObjectId,
		furigana: String,
		fullname: String,
		email: String,
		tel: String,
		children:[Child],
	}));

module.exports = EventRegistration;

