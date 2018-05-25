/*
	event
*/

const model =require('../models/event');
const join =require('../models/join');
const express = require('express');
const router = express.Router();
const addroute = require('./resource-router');
const restapi =require('./restapi');

	var edit = 'name startDatetime endDatetime place description staffBefore staffMax staffApplicant studentBefore studentMax studentApplicant VisitorBefore VisitorMax VisitorApplicant';

	restapi.eventStatusUpdate(router, model, join); // ����Ґ��̍X�V

	// create and export a Router, mount it anywhere via .use()
addroute(router, [
//		restapi.schema(model),
		restapi.create(model),
		restapi.update(model, edit),
		restapi.remove(model),
	]);

	restapi.findPublic(router, model)
	restapi.readPublic(router, model)

exports = module.exports = router;
