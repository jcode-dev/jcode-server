// ベースのドキュメント（全てのドキュメント共通）
var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var Schema = mongoose.Schema;

//
var DocSchema = new Schema({
	name: String,
	title: String,
	ownerId: Schema.Types.ObjectId,
},{ timestamps: {} });
DocSchema.plugin(findOrCreate);
module.exports = mongoose.model('Doc', DocSchema);
