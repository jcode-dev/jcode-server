/*
list:		GET /resources
create:	POST /resources
read:		GET /resources/:id
update:	PUT /resources/:id
delete:	DELETE /resources/:id


Filter
=		filed = value
start		何番目から
limit		最大数

sort		sort=[field] or sort=-[field]

*/

var restfull = require('./restfull');
const model =require('../models/event'); // event model

// create and export a Router, mount it anywhere via .use()
var router = restfull('_id', model);

exports = module.exports = router;
