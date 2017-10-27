var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var schema = mongoose.Schema;

var code = new schema({
  name: String,   // Owner
  type: String, // filename
  xml: String, // filename
  creator: String
});
code.plugin(findOrCreate);
module.exports = mongoose.model('Code', code);
