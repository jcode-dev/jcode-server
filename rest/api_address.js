/*
	address
*/

const model =require('../models/address');
const express = require('express');
const router = express.Router();
const addroute = require('./resource-router');
const restapi =require('./restapi');

	var read = '_id name furigana zipcode address1 address2 tel';
	var edit = 'name furigana zipcode address1 address2 tel';

// create and export a Router, mount it anywhere via .use()
addroute(router, [
		restapi.update(model, edit),
		restapi.find(model),
		restapi.schema(model),
		restapi.read(model, read),
		restapi.remove(model),
		restapi.create(model),
	]);

exports = module.exports = router;
