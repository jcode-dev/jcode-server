var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var displayName = (req.user)? req.user.displayName : 'default';
  res.render('editor.html', { title: 'editor', displayName: displayName});
});

module.exports = router;