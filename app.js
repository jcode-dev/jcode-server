var express = require('express');
const mustacheExpress = require('mustache-express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//require('./authentication/google');
//require('./authentication/facebook');


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
//app.set('view engine', 'mustache');

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





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
