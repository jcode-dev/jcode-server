/*
 * rest endpoint の登録
 */
const path = require('path');
const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit')

// 均等割り付け
function kinto(doc, msg, x, y, width, fontsize) {

	if (! msg) {
		return;
	}
	var dx = (width - fontsize) / (msg.length - 1);

	for (var i = 0; i < msg.length; i++) {
		var c = msg.substr(i, 1);
		doc.text(c, x, y)
		x += dx;
	}
}

// 名刺PDF出力
router.post('/businesscards', (req, res) => {

	const filename = "businesscards.pdf"
	var users = req.body.users; // 出力する人々

	const doc = new PDFDocument({
	  size: [594, 842], // a smaller document for small badge printers
	  margin: 1,
	});
	res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
	res.setHeader('Content-type', 'application/pdf')

	doc.font(path.join(__dirname, './IPAexfont00301/ipaexm.ttf'))

//0.3528mm

	var sx = 39;
	var sy = 31;
	var dx = 258;
	var dy = 156;
	var n = 0;

	for (user of users) {
		if (n == 10) {
			n = 0;
			doc.addPage()
		}

		var x = sx + (dx * (n % 2));
		var y = sy + (dy * parseInt(n / 2));
		doc.fontSize (14)
		doc.text(user.number  , x+10, y+12)
		//doc.text(user.furigana, x+20, y+50, {width: 200, align: 'center'})
		kinto(doc, user.furigana, x+40, y+44, 160, 14);
		doc.fontSize (10)
		doc.text(user.sno  , x+15, y+82)

		doc.fontSize (18)
		//doc.text(user.fullname, x+20, y+70, {width: 200, align: 'center'})
		kinto(doc, user.fullname, x+40, y+70, 160, 18);
		doc.fontSize (11)
		doc.text(user.address1, x+16, y+115)
		doc.text(user.address2, x+16, y+130)
		if (user.cdopassword) {
			doc.image(path.join(__dirname, '../ui/img/'+user.cdopassword), x+220, y+12, {fit: [32, 32]})
		}
		doc.fontSize (10)
		doc.text(user.newpass  , x+230, y+48)
		n++;
	}
	doc.pipe(res)
	doc.end()

})

// 賞状PDF出力
router.post('/certificates', (req, res) => {

	const filename = "certificates.pdf"
	var users = req.body.users; // 出力する人々

	const doc = new PDFDocument({
	  size: [594, 421], // a smaller document for small badge printers
	  margin: 1,
	});
	res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
	res.setHeader('Content-type', 'application/pdf')

	doc.font(path.join(__dirname, './IPAexfont00301/ipaexm.ttf'))

//0.3528mm

	var addflag = false;
	for (user of users) {
		if (addflag) {
			doc.addPage()
		}
		doc.image(path.join(__dirname, '../ui/img/hour_of_code_certificate.jpg'), 0, 0, {fit: [594, 421]})
		doc.fontSize (18)
		doc.text(user.name, 207, 158, {width:180, align:'center'})
		//kinto(doc, user.name, 207, 158, 180, 18);
		doc.fontSize (10)
		doc.text(user.number, 98, 346)
		addflag = true;
	}
	doc.pipe(res)
	doc.end()

})

exports = module.exports = router;

