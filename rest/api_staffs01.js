/*
	staffs01
*/

const model =require('../models/staffs01');
const express = require('express');
const router = express.Router();
const restapi =require('./restapi');

	restapi.readSurvey(router, model);
	restapi.updateSurvey(router, model);
	restapi.listSurvey(router, model);

exports = module.exports = router;
