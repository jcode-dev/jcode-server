
var express = require('express');
var router = express.Router();

var go = {};
go.router = router;
go.successRedirect = '/';
go.failureRedirect = '/ui/signin';

router.all('*', function(req, res, next) {
	let nexturl = req.url;
	go.successRedirect = nexturl;
  res.render('../ui/signin/index.html',{
		nexturl:nexturl,
  });
});

go.redirect = function(req, res) {
	// 認証に施工すると、この関数が呼び出される。
	// 認証されたユーザーは `req.user` に含まれている。
	console.log("redirect:", go.successRedirect);
	res.redirect(go.successRedirect);
}

module.exports = go;
