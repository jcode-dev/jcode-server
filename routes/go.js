
var express = require('express');
var router = express.Router();

var go = {};
go.router = router;
go.successRedirect = '/';
go.failureRedirect = '/ui/signin';

router.all('*', function(req, res, next) {
	var url = req.url.split('/');
	var html = "../ui/user/";
	var nexturl = "";

	if (url[1] === 'password') {
		html = html+'password.html';
		nexturl = '/' + url.slice(2).join('/');
	} else if (url[1] === 'newuser') {
		html = html+'newuser.html';
		nexturl = '/' + url.slice(2).join('/');
	} else if (url[1] === 'profile') {
		html = html+'profile.html';
		nexturl = '/' + url.slice(2).join('/');
	} else {
		html = html+'index.html';
		nexturl = '/' + url.slice(1).join('/');
	}
	//go.successRedirect = nexturl;
  res.render(html, {
		nexturl:nexturl,
		//secret:"7878",
  });
});

go.redirect = function(req, res) {
	// 認証に施工すると、この関数が呼び出される。
	// 認証されたユーザーは `req.user` に含まれている。
	console.log("redirect:", go.successRedirect);
	//res.redirect(go.successRedirect);
}

module.exports = go;
