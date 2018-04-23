//var keystone = require('keystone');
//var User = keystone.list('User');

const mustache = require('mustache');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports = module.exports = function (to, subject, text, html) {

	let msg = {
	  to: to,
	  from: process.env.SENDGRID_FROM,
	  subject: subject,
	  text: text,
	  html: html,
	};
	console.log("msg:", msg);
	
	sgMail.send(msg);

};
/*
exports = module.exports = function (to, subject, template, vars) {

	let msg = {
	  to: to,
	  from: process.env.SENDGRID_FROM,
	  subject: subject,
	  text: mustache.render(template, vars),
	};
	console.log("msg:", msg);
	sgMail.send(msg);

};
*/
