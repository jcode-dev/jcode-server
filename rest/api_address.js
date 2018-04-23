/*
find:		GET /resources
create:	POST /resources
read:		GET /resources/:id
update:	PUT /resources/:id
delete:	DELETE /resources/:id
*/

var restfull = require('./restfull');
const model =require('../models/address');

// create and export a Router, mount it anywhere via .use()
var router = restfull('_id', model);

exports = module.exports = router;
