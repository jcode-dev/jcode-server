var express = require('express');
var router = express.Router();
var Document = require('../models/document');
var mongoose = require('mongoose');

// 編集用ページの表示(ログイン時はドキュメント一覧)
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

// idで指定した文章の編集
router.get('/edit/:id', function(req, res, next) {
  var userid = (req.user)? req.user._id : 'default';
  var _id = mongoose.Types.ObjectId(req.params.id);
  Document.findOne({ '_id' : _id }, function(err, result) {
    res.render('editor.html', { title: 'editor', doc: result});
  });
});

// test
// >curl -XPOST -H "Content-Type: application/json" -d '{"content": "Hello, world!"}' http://localhost:3000/doc/write?_id=59be0b1509f52c295f8a881d
router.post('/update', function(req, res, next) {
  var userid = (req.user)? req.user._id : 'default';
  console.log(userid, req.body);
  var _id = mongoose.Types.ObjectId(req.body._id);
  var text = req.body.content;
  var doc = write(userid, _id, res, text);

});

module.exports = router;
