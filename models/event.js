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

	mainrole: String, // �N�����̃C�x���g���H PARENT, STUDENT, STAFF

	studentBefore: Number, // ���k�̉�������i�����O�܂Łj0=��t�I��
	studentLimit: Number, // ���k�̍ő��t���i0=�������j
	studentMax: Number, // ���k�̒��
	studentApplicant: Number, // ���k�̉��吔
	studentPublic: Boolean, // ��ʐ��k�Ɍ��J����C�x���g���H
/*
	staffBefore: Number,		// �p�~
	staffMax: Number,		// �p�~
	staffApplicant: Number,		// �p�~
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
