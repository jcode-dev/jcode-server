/*
	join
*/

const model =require('../models/join');
const express = require('express');
const router = express.Router();
const addroute = require('./resource-router');
const restapi =require('./restapi');

	var read = '_id name';
	var edit = 'name';

// create and export a Router, mount it anywhere via .use()
function register() {
	addroute(router, [

		restapi.find(model),
		restapi.schema(model),
		restapi.create(model),
		restapi.read(model),
		restapi.update(model),
		restapi.remove(model),
	]);
}
register();

exports = module.exports = router;
