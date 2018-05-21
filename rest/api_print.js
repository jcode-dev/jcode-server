/*
 * rest endpoint の登録
 */
 var path = require('path');
const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit')

// 名刺PDF出力
router.post('/businesscards', (req, res) => {

	var memo = req.body.memo;
	console.log(req.body.users);

	const doc = new PDFDocument({
	  size: [594, 842], // a smaller document for small badge printers
	  margin: 1,
	});
	let filename = "businesscards.pdf"
	res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
	res.setHeader('Content-type', 'application/pdf')

	doc.font(path.join(__dirname, './IPAexfont00301/ipaexm.ttf'))

//0.3528mm

	var sx = 39;
	var sy = 31;
	var dx = 258;
	var dy = 156;
	var n = 0;

	for (user of req.body.users) {
		var x = sx + (dx * (n % 2));
		var y = sy + (dy * parseInt(n / 2));
		doc.fontSize (14)
		doc.text(user.number  , x+10, y+10)
		doc.text(user.furigana, x+20, y+50, {width: 200, align: 'center'})
		doc.fontSize (18)
		doc.text(user.fullname, x+20, y+70, {width: 200, align: 'center'})
		doc.fontSize (11)
		doc.text(user.address1, x+16, y+115)
		doc.text(user.address2, x+16, y+130)
		if (user.cdopassword) {
			doc.image(path.join(__dirname, '../ui/img/'+user.cdopassword), x+220, y+12, {fit: [32, 32]})
		}
		n++;

		if (n == 10) {
			n = 0;
			doc.addPage()
		}

	}
	doc.pipe(res)
	doc.end()

})

exports = module.exports = router;

