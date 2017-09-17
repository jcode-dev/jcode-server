var express = require('express');
var router = express.Router();
var Document = require('../models/document');
var mongoose = require('mongoose');

// 編集用ページの表示
router.get('/', function(req, res, next) {

  var userid = (req.user)? req.user._id : 'default';
  var displayName = (req.user)? req.user.displayName : 'default';
  
  if (req.user) {
    Document.find({ 'userid' : userid }, function(err, result) {
      res.render('document.html', { title: 'document', displayName: displayName, documents: result });
    });
  } else {
    res.render('home.html');
  }
});
// ドキュメントの追加
// ?filename={{ファイル名}}
function newdoc(userid, filename) {

  var newDoc = new Document();
  // set the user's local credentials
  newDoc.userid = userid;
  newDoc.filename = filename;
  // save the user
  newDoc.save(function(err) {
      if (err){
          console.log('Error in Saving user: '+err);  
          throw err;  
      }
    console.log('User Registration succesful');    
    return newDoc;
  });
}

function add(userid, filename) {
  Document.findOne({"filename" : filename,"userid" : userid, }, function(err, result) {
    // already exists
    if (result) {
        console.log('file already exists with filename: ', result);
        return null;
    } else {
      // if there is no user with that email
      // create the user
      return newdoc(userid, filename);
    }
  });
}
function list (userid,res) {
  Document.find({ 'userid' : userid }, function(err, result) {
    console.log("list", userid, result);
    res.send(result);
  });
}
function read (res, userid, _id) {
//  Document.find({ 'userid' : userid, '_id' : _id }, function(err, result) {
    Document.findOne({ '_id' : _id }, function(err, result) {
      console.log("read", _id, result);
      var text = result ? result.content: "konnichiwa\nsayounara";
      res.send(text);
  });
}
function write (userid, _id, res, text) {
  //Document.find({ 'userid' : userid, '_id' : _id }, function(err, result) {
    console.log("update", _id, text);
    Document.update({ '_id' : _id }, {"content": text}, {});

    Document.findByIdAndUpdate(_id, { $set: { content: text }}, function (err, doc) {
      if (err) return handleError(err);
      res.send(doc);
    });


  }

// /add?filename={{filename}}
router.get('/add', function(req, res, next) {
  var userid = (req.user)? req.user._id : 'default';
  var filename = req.query.filename || 'default';
  var doc = add(userid, filename);
  var param = {"result":"done"};
  res.send(param);
});

// /list
//  return []
router.get('/list', function(req, res, next) {
  var userid = (req.user)? req.user._id : 'default';
  var doc = list(userid,res);

});

router.get('/read', function(req, res, next) {
  var userid = (req.user)? req.user._id : 'default';
  var _id = mongoose.Types.ObjectId(req.query._id);
  var doc = read(res, userid, _id);

});
router.post('/write', function(req, res, next) {
  var userid = (req.user)? req.user._id : 'default';
  var _id = mongoose.Types.ObjectId(req.query._id);
  //res.setHeader('Content-Type', 'text/plain');
  //console.log(req.query._id, _id);
console.log("body", req.body);
  var text = req.body.content;
  var doc = write(userid, _id, res, text);

});

module.exports = router;
