/*
 * rest endpoint の登録
 */
const model =require('../models/user'); // User model
const express = require('express');
const router = express.Router();
const addroute = require('./resource-router');
const restapi =require('./restapi');

const read = '_id number email ';
const edit = 'mainrole name furigana fullname grade sno zipcode address1 address2 tel hadInsurance memo cdosection cdopassword microbitLending insurance2018 groupname';
const admin = ' ownerId email'
	restapi.signinAdmin(router, model);
	restapi.whoami(router, model, read+edit);
	restapi.read(router, model, read+edit),
	restapi.password(router, model);
	restapi.findUser(router, model, read+edit),
	restapi.reset2(router, model);

addroute(router, [
	restapi.children(model),
	restapi.reset(model),
	restapi.signup(model),
	restapi.signin(model),
	restapi.nsignin(model),

	restapi.schema(model, edit),

	restapi.update(model, edit),
	restapi.adminUpdate(model, edit+admin),
	restapi.remove(model),
	restapi.create(model),
]);


exports = module.exports = router;

