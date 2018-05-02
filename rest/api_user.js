/*
 * rest endpoint の登録
 */
const model =require('../models/user'); // User model
const express = require('express');
const router = express.Router();
const addroute = require('./resource-router');
const restapi =require('./restapi');

const read = '_id number name furigana fullname grade email';
const edit = 'name furigana fullname grade';

addroute(router, [
	restapi.whoami(model),
	restapi.children(model),
	restapi.reset(model),
	restapi.signup(model),
	restapi.signin(model),
	restapi.password(model),

	restapi.find(model, read),
	restapi.schema(model, edit),

	restapi.read(model, read),
	restapi.update(model, edit),
	restapi.remove(model),
	restapi.create(model),
]);

exports = module.exports = router;

