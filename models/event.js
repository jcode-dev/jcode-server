var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var Schema = mongoose.Schema;
var EventSchema = new Schema({
	name: String,
	date: Date,
});
EventSchema.plugin(findOrCreate);
module.exports = mongoose.model('Event', EventSchema);
