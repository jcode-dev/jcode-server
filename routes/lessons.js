
var express = require('express');
var router = express.Router();

function getExtension(fileName) {
  var ret = "";
  if (!fileName) {
    return ret;
  }
  var fileTypes = fileName.split(".");
  var len = fileTypes.length;
  if (len < 2) {
    return ret;
  }
  ret = fileTypes[len - 1].toLowerCase();
  return ret;
}

router.get('*', function(req, res, next) {
  //console.log(req.params, req.query);
  var displayName = (req.user) ? req.user.displayName : "<guest>";
  var item = req.params[0].split('/');
  var ldir = "./";
  if (item[item.length - 1] == '') {
    item.pop();
    ldir = "../"
  }
  var app = item[item.length - 2];
  var level = item[item.length - 1];
  
  console.log("home URL:", item);
  console.log("app:", app, "level:", level, "ext:", getExtension(level));

  var dir = "./lessons/" + ((app != "")? app + "/" : "");
  if (getExtension(level) == "js") {
    res.render(dir + level);
  } else {
    //ldir = "./" + ((app != "")? app + "/" : "");
    var scriptfilename = ldir + level + ".js";
    console.log("scriptfilename:", scriptfilename);
    res.render(dir + 'index.html', { scriptfilename: scriptfilename});
  }
})

module.exports = router;