// ZŠ•˜A—æ
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Doc = require('./doc');

//
var Join = Doc.discriminator('Join',
	new Schema({
		request: String,
		status: String,
	}));
module.exports = Join;
