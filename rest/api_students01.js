/*
	サーベイ
*/

const express = require('express');
const router = express.Router();
const restapi =require('./restapi');

const students01 =require('../models/students01');
	restapi.readSurvey(router, students01);
	restapi.updateSurvey(router, students01);
	restapi.listSurvey(router, students01);

exports = module.exports = router;
