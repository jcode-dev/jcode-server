// �x�[�X�̃h�L�������g�i�S�Ẵh�L�������g���ʁj
var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var Schema = mongoose.Schema;

//
var DocSchema = new Schema({
	name: String,		// ���J��
	title: String,
	ownerId: Schema.Types.ObjectId,
	memberId: {type: Schema.Types.ObjectId, ref: 'User' },
	groupId: Schema.Types.ObjectId,
},{ timestamps: {} });
DocSchema.plugin(findOrCreate);
module.exports = mongoose.model('Doc', DocSchema);
