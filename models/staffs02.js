// STAFF 02
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Doc = require('./doc');

module.exports = Doc.discriminator('staffs02',
	new Schema({
		age_class: String,	// ”N—î
		q_fun: Number,
		q_brain: Number,
		q_teacher: Number,
		q_again: Number,
		memo: String,
	})
);
