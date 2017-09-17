var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../models/user');
const config = require('config');

module.exports = function(passport){
    passport.use(new GoogleStrategy({
    clientID: config.google.client_id,
    clientSecret: config.google.client_secret,
    callbackURL: 'http://localhost:3000/auth/google/redirect'
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleId: profile.id }, {displayName: profile.displayName}, function (err, user) {
        console.log('A new user from "%s" was inserted', user.googleId);
        return cb(err, user);
        });
    }
    ));
}