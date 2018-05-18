/*
	サーベイ
*/

const express = require('express');
const router = express.Router();
const restapi =require('./restapi');

const staffs01 =require('../models/staffs01');
	restapi.readSurvey(router, staffs01);
	restapi.updateSurvey(router, staffs01);
	restapi.listSurvey(router, staffs01);

exports = module.exports = router;
