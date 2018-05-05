/*******************
 * JCODE Server
 * WWW - ホームページ
 * lessons - レッスン（３Ｄパズル level1, 2, 3）
 * home - mongodbへのログインやら・・
 * editor - mongodb によるカリキュラムのエディター作成途上
 * 
 */
var express = require('express');
const mustacheExpress = require('mustache-express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('config');
require('dotenv').config();

var mongoose = require('mongoose');
// Connect to DB
console.log ("connect to", config.mongodb); 
mongoose.connect(config.mongodb, {}, function(error) {
  if (error) {
    console.log (">sudo service mongod start"); 
    console.log (error); // Check error in initial connection. There is no 2nd param to the callback.
  }
 });
var passport = require('./passport');
var api_user = require('./rest/api_user');
var api_event = require('./rest/api_event');
var api_doc = require('./rest/api_doc');
//var api_address = require('./rest/api_address');
var api_join = require('./rest/api_join');

console.log ("start express app"); 
var app = express();
// view engine setup
app.engine('html', mustacheExpress());
app.engine('js', mustacheExpress());
app.engine('xml', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'mustache');

console.log ("config express app"); 
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORSを許可する
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

console.log ("setup routers"); 

// サーバーREST API
//app.use('/api/address', api_address);
app.use('/api/user', api_user);
app.use('/api/event', api_event);
app.use('/api/doc', api_doc);
app.use('/api/join', api_join);
// クライアント＝ユーザーインタフェース
app.use('/ui', express.static(path.join(__dirname, './ui')));
// サインイン＆リダイレクト
var go = require('./routes/go');
app.use('/go', go.router);

// ログイン
app.use(passport.initialize());
app.post('/signin',
  passport.authenticate('local', {
                                   failureRedirect: '/ui/signin' }), go.redirect
);


//app.use(express.static(path.join(__dirname, 'public')));
app.use('/blockly', express.static(path.join(__dirname, '../blockly')));
app.use('/three', express.static(path.join(__dirname, '../three.js')));
app.use('/jcode', express.static(path.join(__dirname, '../jcode')));
app.use('/physics', express.static(path.join(__dirname, '../physics')));
app.use('/ace', express.static(path.join(__dirname, '../ace-builds')));
app.use('/bootstrap', express.static(path.join(__dirname, '../bootstrap-3.3.7-dist')));
app.use('/pub', express.static(path.join(__dirname, '../pub')));
//app.use('/lessons', express.static(path.join(__dirname, '../lessons')));

console.log ("start www..."); 
// 昔の301リダイレクト対策
app.get('/kitaku', function(req, res) {
res.redirect(302, "/");
});
app.use('/', express.static(path.join(__dirname, '../www'), {extensions: ['htm', 'html']}));

// アプリのホーム
var home = '/home';

var routesHome = require('./routes/home');
app.use('/home', routesHome);

var lessons = require('./routes/lessons');
app.use('/lessons', lessons);

var editor = require('./routes/editor');
app.use('/editor', editor);

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
  //res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.error = {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error.html', {message: res.locals.message, error: res.locals.error});
});

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', { error: err });
}

module.exports = app;


/*
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
// Serialize/desirialize Passport
require('./passport/init')(passport);

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());


// Google Strategy
//  https://developers.google.com/identity/sign-in/web/devconsole-project?hl=ja
require('./passport/google')(passport);

// Local Strategy
require('./passport/login')(passport);
require('./passport/signup')(passport);

var authentication = require('./routes/authentication')(home, passport);
app.use('/auth', authentication);
*/
