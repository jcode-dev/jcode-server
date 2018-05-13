// スタッフ サーベイ 01
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Doc = require('./doc');

module.exports = Doc.discriminator('staffs01',
	new Schema({
		q_exec: Number,
		q_program: Number,
		week_day: Boolean,
		sat_am: Boolean,
		sat_pm: Boolean,
		week_day: Boolean,
		sun_am: Boolean,
		sun_pm: Boolean,
		q_time: Number,
		age_class: String,
		memo: String,
	})
);
