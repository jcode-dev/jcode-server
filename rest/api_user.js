/*
 * rest endpoint の登録
 */

//const keystone = require('keystone');
const model =require('../models/user'); // User model
const addRoutes = require('./resource-router').addRoutes;
const restapi =require('./restapi');

var read = '_id number title name email';
var edit = 'title name';

exports = module.exports = addRoutes([

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
