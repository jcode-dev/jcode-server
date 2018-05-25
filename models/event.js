// イベント登録
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Doc = require('./doc');

var eventSchema = new Schema({
	startDatetime: Date,
	endDatetime: Date,
	place: String,
	description: String,
	staffBefore: Number,		// スタッフ応募期日
	staffMax: Number,		// スタッフ定員
	staffApplicant: Number,		// スタッフ応募数
	studentBefore: Number, // 生徒の応募期日（何日前まで）0=受付終了
	studentMax: Number, // 生徒の定員
	studentApplicant: Number, // 生徒の応募数
	VisitorBefore: Number,
	VisitorMax: Number,
	VisitorApplicant: Number,
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
