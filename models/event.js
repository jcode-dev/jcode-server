// ƒCƒxƒ“ƒg“o˜^
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Doc = require('./doc');

var eventSchema = new Schema({
	startDatetime: Date,
	endDatetime: Date,
	place: String,
	description: String,

	mainrole: String, // ’NŒü‚¯‚ÌƒCƒxƒ“ƒg‚©H PARENT, STUDENT, STAFF

	studentBefore: Number, // ¶“k‚Ì‰•åŠú“úi‰½“ú‘O‚Ü‚Åj0=ó•tI—¹
	studentMax: Number, // ¶“k‚Ì’èˆõ
	studentApplicant: Number, // ¶“k‚Ì‰•å”
	studentPublic: Boolean, // ˆê”Ê¶“k‚ÉŒöŠJ‚·‚éƒCƒxƒ“ƒg‚©H
/*
	staffBefore: Number,		// ”p~
	staffMax: Number,		// ”p~
	staffApplicant: Number,		// ”p~
*/
})
/*
var virtual = eventSchema.virtual('localStartDatetime');
virtual.get(function () {
	let date = this.startDatetime;
	console.log("virtual !!!!!!!!", this.startDatetime);
	return date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+' '+date.getHours()+':' + ('00'+date.getMinutes()).slice(-2);
});

*/

var Event = Doc.discriminator('Event', eventSchema);
module.exports = Event;
