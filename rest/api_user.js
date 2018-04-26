/*
 * rest endpoint の登録
 */
const model =require('../models/user'); // User model
const express = require('express');
const router = express.Router();
const addroute = require('./resource-router');
const restapi =require('./restapi');

const read = '_id number title name email';
const edit = 'title name';

function register() {
	addroute(router, [
		restapi.whoami(model),
		restapi.children(model),
		restapi.reset(model),
		restapi.signup(model),
		restapi.signin(model),

		restapi.find(model, read),
		restapi.schema(model, edit),

		restapi.read(model, read),
		restapi.update(model, edit),
		restapi.remove(model),
	]);
}
register();

exports = module.exports = router;

