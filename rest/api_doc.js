/*
	doc
*/

const model =require('../models/doc');
const express = require('express');
const router = express.Router();
const addroute = require('./resource-router');
const restapi =require('./restapi');

	var read = '_id name';
	var edit = 'name';

// create and export a Router, mount it anywhere via .use()
addroute(router, [

		restapi.find(model, read),
		restapi.schema(model, edit),
		restapi.create(model, edit),
		restapi.read(model, read),
		restapi.update(model, edit),
		restapi.remove(model),
	]);

exports = module.exports = router;

