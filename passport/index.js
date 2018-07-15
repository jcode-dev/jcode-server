/**
 *パスポートの初期化
 */
//var keystone = require('keystone');
require('dotenv').config();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');


// Passport needs to be able to serialize and deserialize users to support persistent login sessions
passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

var isValidPassword = function(user, password){
	return bCrypt.compareSync(password, user.password);
}

// Local Strategy
passport.use(new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password'
}, function(email, password, done) {
		//console.log('findOne: ', username);
		// check in mongo if a user with username exists or not
		User.findOne({ 'email' :  email }).exec(function (err, user) {
			// In case of any error, return using the done method
			if (err) { return done(err); }
			// Username does not exist, log the error and redirect back
			if (!user){
				console.log('User Not Found with username ');
				return done(null, false, {message: 'User Not found.'});
			}
			// User exists but wrong password, log the error 
			if (!isValidPassword(user, password)){
				console.log('Invalid Password');
				return done(null, false, {message: 'Invalid Password'}); // redirect back to login page
			}
			// User and password both match, return user from done method
			// which will be treated like success
			//console.log('login: ', user);
			return done(null, user);
		});
	}
));

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
if (!process.env.JWT_ISSUER) {
	console.log("ERROR !!!! need configure .env for process.env.JWT_ISSUER");
}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
opts.issuer = process.env.JWT_ISSUER;
opts.audience = process.env.JWT_AUDIENCE;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
	//console.log("jwt:", jwt_payload.sub);
	User.findById(jwt_payload.sub, function(err, user) {
		//console.log("err:", err, "user:", user);
		if (err) {
			return done(err, false);
		}
		if (user) {
			return done(null, user);
		} else {
			return done(null, false);
		}
	});
}));

module.exports = passport;
