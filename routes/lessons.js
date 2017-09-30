
var express = require('express');
var router = express.Router();

router.get('*', function(req, res, next) {
  //console.log(req.params, req.query);
  var displayName = (req.user) ? req.user.displayName : "<guest>";
  var item = req.params[0].split('/');
  console.log("home URL:", item);
  if (item[2] != "") {
    res.render('./lessons/'+item[2]);
  } else {
    var scriptfilename = (item[1]=="")? "default.js" : item[1] + ".js";
    res.render('./lessons/index.html',
      { scriptfilename: scriptfilename });
   }
})

module.exports = router;