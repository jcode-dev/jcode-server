var express = require('express');
var router = express.Router();

module.exports = function(home, passport) {

	/* GET login page. */
	router.get('/login', function(req, res) {
		res.render('login.html',{loginUrl: 'login', signupUrl: 'signup'});
	});

	router.post('/login',	passport.authenticate('login', {
		successRedirect: home,
		failureRedirect: 'login',
		failureFlash : false  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('signup.html',{signupUrl: 'signup'});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: home,
		failureRedirect: 'signup',
		failureFlash : true  
	}));

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect( home );
	});

	// Google page
	router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

	// Google Reirect page - developers.gooogle.com
	router.get('/google/redirect',
		passport.authenticate('google', { failureRedirect: 'login' }), function(req, res) {
			console.log("google login :", req.user);
			// Successful authentication, redirect home.
			res.redirect(req.headers.referer); // redirect to 呼び出し元
	});

	return router;
}


