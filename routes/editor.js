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
    //console.log('User Registration succesful');    
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
  //Document.update({ '_id' : _id }, {"content": text}, {});

  Document.findByIdAndUpdate(_id, { $set: { content: text }}, function (err, doc) {
    if (err) return handleError(err);
    res.send(doc);
  });
}
function rename (userid, _id, res, filename) {
  //Document.find({ 'userid' : userid, '_id' : _id }, function(err, result) {
  //Document.update({ '_id' : _id }, {"filename": filename}, {});

  Document.findByIdAndUpdate(_id, { $set: { filename: filename }}, function (err, doc) {
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

// idで指定した文章の読み込み
router.get('/read/:id', function(req, res, next) {
  var userid = (req.user)? req.user._id : 'default';
  var _id = mongoose.Types.ObjectId(req.params.id);
  Document.findOne({ '_id' : _id }, function(err, result) {
    res.send(result.content);
  });
});

// idで指定したjsonの読み込み
router.get('/getJson/:id', function(req, res, next) {
  var userid = (req.user)? req.user._id : 'default';
  var _id = mongoose.Types.ObjectId(req.params.id);
  Document.findOne({ '_id' : _id }, function(err, result) {
    res.send(result);
  });
});

// filename で指定したjsonの読み込み
router.get('/getJsonByName/:filename', function(req, res, next) {
  var userid = (req.user)? req.user._id : 'default';
  var filename = req.params.filename;
  Document.findOne({ 'filename' : filename }, function(err, result) {
    res.send(result);
  });
});

// 書き込み
// >curl -XPOST -H "Content-Type: application/json" -d '{"content": "Hello, world!"}' http://localhost:3000/doc/write?_id=59be0b1509f52c295f8a881d
router.post('/update', function(req, res, next) {
  var userid = (req.user)? req.user._id : 'default';
  console.log(userid, req.body);
  var _id = mongoose.Types.ObjectId(req.body._id);
  var text = req.body.content;
  var doc = write(userid, _id, res, text);

});

// リネーム
router.post('/rename', function(req, res, next) {
  var userid = (req.user)? req.user._id : 'default';
  console.log(userid, req.body);
  var _id = mongoose.Types.ObjectId(req.body._id);
  var filename = req.body.filename;
  var doc = rename(userid, _id, res, filename);

});

// update filename
router.post('/post_filename', function(req, res, next) {
  var userid = (req.user)? req.user._id : 'default';
  var _id = mongoose.Types.ObjectId(req.body._id);
  var filename = req.body.filename;
  Document.findByIdAndUpdate(_id, { $set: { filename: filename }}, function (err, doc) {
    if (err) return handleError(err);
    res.send(doc);
  });
});
// update description_txt
router.post('/post_description_txt', function(req, res, next) {
  var userid = (req.user)? req.user._id : 'default';
  var _id = mongoose.Types.ObjectId(req.body._id);
  var description_txt = req.body.description_txt;
  Document.findByIdAndUpdate(_id, { $set: { description_txt: description_txt }}, function (err, doc) {
    if (err) return handleError(err);
    res.send(doc);
  });
});
// update start_html
router.post('/post_start_html', function(req, res, next) {
  var userid = (req.user)? req.user._id : 'default';
  var _id = mongoose.Types.ObjectId(req.body._id);
  var start_html = req.body.start_html;
  Document.findByIdAndUpdate(_id, { $set: { start_html: start_html }}, function (err, doc) {
    if (err) return handleError(err);
    res.send(doc);
  });
});
// update start_js
router.post('/post_start_js', function(req, res, next) {
  var userid = (req.user)? req.user._id : 'default';
  var _id = mongoose.Types.ObjectId(req.body._id);
  var start_js = req.body.start_js;
  console.log("post start js",start_js)
  Document.findByIdAndUpdate(_id, { $set: { start_js: start_js }}, function (err, doc) {
    if (err) return handleError(err);
    res.send(doc);
  });
});
// update toolbox_xml
router.post('/post_toolbox_xml', function(req, res, next) {
  var userid = (req.user)? req.user._id : 'default';
  var _id = mongoose.Types.ObjectId(req.body._id);
  var toolbox_xml = req.body.toolbox_xml;
  Document.findByIdAndUpdate(_id, { $set: { toolbox_xml: toolbox_xml }}, function (err, doc) {
    if (err) return handleError(err);
    res.send(doc);
  });
});
// update blocks_xml
router.post('/post_blocks_xml', function(req, res, next) {
  var userid = (req.user)? req.user._id : 'default';
  var _id = mongoose.Types.ObjectId(req.body._id);
  var blocks_xml = req.body.blocks_xml;
  Document.findByIdAndUpdate(_id, { $set: { blocks_xml: blocks_xml }}, function (err, doc) {
    if (err) return handleError(err);
    res.send(doc);
  });
});

module.exports = router;
