// ベースのドキュメント（全てのドキュメント共通）
var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var Schema = mongoose.Schema;

//
var DocSchema = new Schema({
	name: String,		// 公開名
	ownerId: Schema.Types.ObjectId,
	title: String,
},{ timestamps: {} });
DocSchema.plugin(findOrCreate);
module.exports = mongoose.model('Doc', DocSchema);
