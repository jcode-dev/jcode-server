
var express = require('express');
var router = express.Router();
var Document = require('../models/document');
var mongoose = require('mongoose');

router.get('*', function(req, res, next) {
  //console.log(req.params, req.query);
  var displayName = (req.user) ? req.user.displayName : "<guest>";
  var item = req.params[0].split('/');
  var filename = item[1];
  console.log(filename);

  Document.findOne({ 'filename' : filename }, function(err, result) {
    if (result) {
      res.send(result.content);
    } else {
      res.render('./jcode/index.html', { title: 'Hey', displayName: displayName, filename: filename });
    }
  });
});

module.exports = router;