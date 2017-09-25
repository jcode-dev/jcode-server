
var express = require('express');
var router = express.Router();
var Document = require('../models/document');
var mongoose = require('mongoose');
var fs = require("fs");

router.get('/start.js', function(req, res, next) {
  res.render('./jcode/start.js',{});
});
router.get('/toolbox.xml', function(req, res, next) {
  res.render('./jcode/toolbox.xml',{});
});

router.get('*', function(req, res, next) {
  //console.log(req.params, req.query);
  var displayName = (req.user) ? req.user.displayName : "<guest>";
  var item = req.params[0].split('/');
  var filename = item[1];
  console.log("home URL:", filename);

  Document.findOne({ 'filename' : filename }, function(err, result) {
    if (result) {
      res.send(result.content);
    } else {
      res.render('./jcode/index.html',
       { start_filename: '/lesson/' + filename + '/start.js', title: 'Hey', displayName: displayName, filename: filename });
    }
  });
});

module.exports = router;