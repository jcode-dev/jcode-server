// �x�[�X�̃h�L�������g�i�S�Ẵh�L�������g���ʁj
var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var Schema = mongoose.Schema;

//
var DocSchema = new Schema({
	name: String,		// ���J��
	ownerId: Schema.Types.ObjectId,
	title: String,
},{ timestamps: {} });
DocSchema.plugin(findOrCreate);
module.exports = mongoose.model('Doc', DocSchema);
