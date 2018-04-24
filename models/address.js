// ZŠ•˜A—æ
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Doc = require('./doc');

//
var Address = Doc.discriminator('Address',
	new Schema({
		furigana: String,
		zipcode: String,
		address1: String,
		address2: String,
		tel: String,
	}));
module.exports = Address;
