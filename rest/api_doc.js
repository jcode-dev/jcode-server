/*
	doc
*/

const model =require('../models/doc');
const toRes = require('./resource-router').toRes;
const addRoutes = require('./resource-router').addRoutes;
const restapi =require('./restapi');

// create and export a Router, mount it anywhere via .use()
exports = module.exports = addRoutes([
	restapi.find(model),
	restapi.schema(model),
	restapi.create(model),
	restapi.read(model),
	restapi.update(model),
	restapi.remove(model),
]);
