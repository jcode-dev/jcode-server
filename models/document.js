var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var schema = mongoose.Schema;

var document = new schema({
  userid: String,
  filename: String,
  content: String
});
document.plugin(findOrCreate);
module.exports = mongoose.model('Document', document);
