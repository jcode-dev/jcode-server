// �C�x���g�o�^
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Doc = require('./doc');

var eventSchema = new Schema({
	startDatetime: Date,
	endDatetime: Date,
	place: String,
	description: String,
	staffBefore: Number,		// �X�^�b�t�������
	staffMax: Number,		// �X�^�b�t���
	staffApplicant: Number,		// �X�^�b�t���吔
	studentBefore: Number, // ���k�̉�������i�����O�܂Łj0=��t�I��
	studentMax: Number, // ���k�̒��
	studentApplicant: Number, // ���k�̉��吔
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
