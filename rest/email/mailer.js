//var keystone = require('keystone');
//var User = keystone.list('User');

const fs = require('fs');
const mustache = require('mustache');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


exports = module.exports = function (to, subject, template, vars) {

	fs.readFile(template, function (err, data) {
		console.log("mailer1:", __dirname);
		console.log("mailer2:", err);
	  if (err) return;
	  var output = mustache.render(data.toString(), vars);
		let msg = {
		  to: to,
		  cc: process.env.SENDGRID_FROM,
		  from: process.env.SENDGRID_FROM,
		  subject: subject,
		  text: output,
		};
		console.log("msg:", msg);

		// 今は、送信します
		// console.log("送信しません！！");
		if (true) {
			sgMail.send(msg);
		}

	});
};

