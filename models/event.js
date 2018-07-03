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

	mainrole: String, // 誰向けのイベントか？ PARENT, STUDENT, STAFF

	studentBefore: Number, // 生徒の応募期日（何日前まで）0=受付終了
	studentLimit: Number, // 生徒の最大受付数（0=無制限）
	studentMax: Number, // 生徒の定員
	studentApplicant: Number, // 生徒の応募数
	studentPublic: Boolean, // 一般生徒に公開するイベントか？
/*
	staffBefore: Number,		// 廃止
	staffMax: Number,		// 廃止
	staffApplicant: Number,		// 廃止
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
