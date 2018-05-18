
var express = require('express');
var router = express.Router();

var go = {};
go.router = router;
go.successRedirect = '/';
go.failureRedirect = '/ui/signin';

router.all('*', function(req, res, next) {
	var url = req.url.split('/');
	var base = "../ui/user/";
	var nexturl = "";
	var html = "";
	var tbl ={
		'password': 'password.html', // パスワードのリセットメールを送信
		'chgpass': 'chgpass.html', // パスワードの変更
		'newuser': 'newuser.html',	// 新規ユーザー登録
		'profile': 'profile.html',	// 住所等の追加情報入力
		'staffs01': 'staffs01.html',	// STAFFアンケート01
		'students01': 'students01.html',	// 生徒アンケート01
	}

	html = tbl[url[1]];
	if (html) { // tblに存在するなら
		nexturl = '/' + url.slice(2).join('/');
	} else {
		html = 'index.html';		// メールによるサインイン
		nexturl = '/' + url.slice(1).join('/');
	}
/*
	if (url[1] === 'password') {
		html = 'password.html';
		nexturl = '/' + url.slice(2).join('/');
	} else if (url[1] === 'newuser') {
		html = 'newuser.html';
		nexturl = '/' + url.slice(2).join('/');
	} else if (url[1] === 'profile') {
		html = 'profile.html';
		nexturl = '/' + url.slice(2).join('/');
	} else {
		html = 'index.html';
		nexturl = '/' + url.slice(1).join('/');
	}
*/

	//go.successRedirect = nexturl;
  res.render(base + html, {
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
