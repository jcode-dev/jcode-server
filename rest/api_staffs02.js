/*
	サーベイ
*/

const express = require('express');
const router = express.Router();
const restapi =require('./restapi');

const survey =require('../models/staffs02');
	restapi.readSurvey(router, survey);
	restapi.updateSurvey(router, survey);
	restapi.listSurvey(router, survey);

exports = module.exports = router;
