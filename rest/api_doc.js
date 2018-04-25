/*
	doc
*/

const model =require('../models/doc');
const toRes = require('./resource-router').toRes;
const addRoutes = require('./resource-router').addRoutes;
const restapi =require('./restapi');

var read = '_id name';
var edit = 'name';

// create and export a Router, mount it anywhere via .use()
exports = module.exports = addRoutes([

	restapi.find(model, read),
	restapi.schema(model, edit),
	restapi.create(model, edit),
	restapi.read(model, read),
	restapi.update(model, edit),
	restapi.remove(model),


]);
