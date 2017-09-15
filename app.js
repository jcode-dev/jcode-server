var express = require('express');
const mustacheExpress = require('mustache-express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//require('./authentication/google');
//require('./authentication/facebook');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var config = require('config');
var mongoose = require('mongoose');
// Connect to DB
console.log ("connect to", config.mongodb); 
mongoose.connect(config.mongodb, {}, function(error) {
  if (error) {
    console.log (">sudo service mongod start"); 
    console.log (error); // Check error in initial connection. There is no 2nd param to the callback.
  }
 });

var app = express();
// view engine setup
app.engine('html', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'mustache');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/blockly', express.static(path.join(__dirname, '../blockly')));
app.use('/three', express.static(path.join(__dirname, '../three.js')));
app.use('/jcode', express.static(path.join(__dirname, '../jcode')));
app.use('/physics', express.static(path.join(__dirname, '../physics')));

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession(
  {
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false
  }));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);
//app.use('/users', users);

// アプリのホーム
app.get('/test', function (req, res) {
  //console.log(req.user);
  var username = (req.user) ? req.user.username : "<guest>";
  res.render('home.html', { title: 'Hey', username: username});
});

var User = require('./models/user');
var findOrCreate = function(profile, done) {
  var username = profile.id;
  // find a user in Mongo with provided username
  User.findOne({ 'username' :  username }, function(err, user) {
      // In case of any error, return using the done method
      if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
      }
      // already exists
      if (user) {
          console.log('User already exists with username: '+username);
          return done(null, user);
      } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();

          // set the user's local credentials
          newUser.username = username;
          newUser.password = ("password");
          newUser.email = ('email');
          newUser.firstName = ('firstName');
          newUser.lastName = ('lastName');

          // save the user
          newUser.save(function(err) {
              if (err){
                  console.log('Error in Saving user: '+err);  
                  throw err;  
              }
              console.log('User Registration succesful');    
              return done(null, newUser);
          });
      }
  });
};

passport.use(new GoogleStrategy({
  clientID: config.google.client_id,
  clientSecret: config.google.client_secret,
  callbackURL: 'http://localhost:3000/api/authentication/google/redirect'
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("accessToken:", accessToken);
    findOrCreate(profile, function (err, user) {
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
app.get('/auth/google',
passport.authenticate('google', { scope: ['profile'] }));

app.get('/api/authentication/google/redirect',
passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  console.log("successful authentication:", req.user);
  // Successful authentication, redirect home.
  res.redirect('/test');
});
/*
app.get('/api/authentication/google/start',
  //passport.authenticate('google', { session: true, scope: ['openid', 'profile', 'email'] }));
  passport.authenticate('google'));
app.get('/api/authentication/google/redirect',
  //passport.authenticate('google', { session: true }),
  //generateUserToken);
  passport.authenticate('google', { successRedirect: '/test',
  failureRedirect: '/test' }));

app.get('/api/authentication/facebook/start',
  passport.authenticate('facebook', { session: false }));
app.get('/api/authentication/facebook/redirect',
  passport.authenticate('facebook', { session: false }),
  generateUserToken);
*/

app.get('/api/insecure', (req, res) => {
  res.send('Insecure response');
});

app.get('/api/secure',
passport.authenticate(['jwt'], { session: false }),
(req, res) => {
    res.send('Secure response from ' + JSON.stringify(req.user));
});





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log("ERROR!!!!",err.message)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
