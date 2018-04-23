// ƒCƒxƒ“ƒg“o˜^
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Doc = require('./doc');

module.exports = Event = Doc.discriminator('Event',
	new Schema({
		startDatetime: Date,
		endDatetime: Date,
		place: String,
		description: String,
	}));

