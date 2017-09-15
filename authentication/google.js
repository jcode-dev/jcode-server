const passport = require('passport');
const passportGoogle = require('passport-google-oauth');
const config = require('config');
const users = require('./users.js');

const passportConfig = {
    clientID: config.google.client_id,
    clientSecret: config.google.client_secret,
    callbackURL: 'http://localhost:3000/api/authentication/google/redirect'
};

if (passportConfig.clientID) {
    passport.use(new passportGoogle.OAuth2Strategy(passportConfig, function (request, accessToken, refreshToken, profile, done) {
        let user = users.getUserByExternalId('google', profile.id);
        if (!user) {
            user = users.createUser(profile.displayName, 'google', profile.id);
        }
        return done(null, user);
    }));
}
