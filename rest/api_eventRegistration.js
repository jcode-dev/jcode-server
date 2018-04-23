/*
find:		GET /resources
create:	POST /resources
read:		GET /resources/:id
update:	PUT /resources/:id
delete:	DELETE /resources/:id
*/

const toRes = require('./resource-router').toRes;
const addRoutes = require('./resource-router').addRoutes;
const model =require('../models/eventRegistration');
const mailer =require('./email/mailer');

// create and export a Router, mount it anywhere via .use()

var restfull = function(model) {
	return addRoutes([
		// create new
		['/', 'post', function(req, res) {
			var body = req.body;
			var to = req.body.email;
			console.log("create:", model.modelName, body);
			model.create(body, function(err, thing) {
				if (!err) {
					mailer(to, '登録', __dirname + "/registration.txt", {subject:'タイトル', body:body});
				}
				res.status(200).send(thing);
			});
		}],
	]);
}

var router = restfull(model);

exports = module.exports = router;
