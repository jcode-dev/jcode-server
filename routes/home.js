var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log(req.params);
  var displayName = (req.user) ? req.user.displayName : "<guest>";
  res.render('home.html', { title: 'Hey', displayName: displayName});
});

router.get('/:id/:section.:no', function(req, res, next) {
  console.log(req.params);
  var displayName = (req.user) ? req.user.displayName : "<guest>";
  res.render('home.html', { title: 'Hey', displayName: displayName});
});

router.get('/:id/:no/', function(req, res, next) {
  console.log(req.params);
  var displayName = (req.user) ? req.user.displayName : "<guest>";
  res.render('home.html', { title: 'Hey', displayName: displayName});
});

module.exports = router;