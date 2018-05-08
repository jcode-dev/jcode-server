/*
	join
*/

const model =require('../models/join');
const express = require('express');
const router = express.Router();
const addroute = require('./resource-router');
const restapi =require('./restapi');

	var read = '';
	var edit = 'status name memberId groupId';

// create and export a Router, mount it anywhere via .use()
addroute(router, [

	restapi.schema(model),
	restapi.read(model, read + edit),
	restapi.update(model, edit),
]);

	restapi.findJoin(router, model);
	restapi.createJoin(router, model);
	restapi.removeJoin(router, model);

exports = module.exports = router;
