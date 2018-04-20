/*
list:		GET /resources
create:	POST /resources
read:		GET /resources/:id
update:	PUT /resources/:id
delete:	DELETE /resources/:id


Filter
=		filed = value
start		‰½”Ô–Ú‚©‚ç
limit		Å‘å”

sort		sort=[field] or sort=-[field]

*/

var restfull = require('./restfull');
const model =require('../models/contact'); // event model

// create and export a Router, mount it anywhere via .use()
var router = restfull('_id', model);

exports = module.exports = router;
