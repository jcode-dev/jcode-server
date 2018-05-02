/*
	event
*/

const model =require('../models/event');
const express = require('express');
const router = express.Router();
const addroute = require('./resource-router');
const restapi =require('./restapi');

	var edit = 'name';

	// create and export a Router, mount it anywhere via .use()
addroute(router, [
		restapi.schema(model),
		restapi.create(model),
		restapi.update(model),
		restapi.remove(model),
	]);

	restapi.findPublic(router, model)
	restapi.readPublic(router, model)

exports = module.exports = router;
