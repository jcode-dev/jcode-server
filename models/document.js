var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var schema = mongoose.Schema;

var document = new schema({
  userid: String,   // Owner
  filename: String, // filename
  description_txt: String, // filename
  start_html: String, //default JavaScript to be running at the begening
  start_js: String, //default JavaScript to be running at the begening
  toolbox_xml: String,  //blockly toolbox XML
  blocks_xml: String,   //blocks loaded at the begining
  content: String
});
document.plugin(findOrCreate);
module.exports = mongoose.model('Document', document);
