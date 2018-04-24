'use strict';
const passport = require('passport');
const toRes = require('./resource-router').toRes;
const addRoutes = require('./resource-router').addRoutes;

var restapi = {};

restapi.find = function(model) {
	return ['/', 'get', function(req, res) {
		var params = req.query;
		console.log("find:", model.modelName, params);
		//console.dir();
		var limit = Math.max(1, Math.min(50, params.limit|0 || 100));

		// if you have fulltext search enabled.
		if (params.search && typeof model.textSearch==='function') {
			return model.textSearch(params.search, {
				limit : limit,
				language : 'en',
				lean : true
			}, toRes(res));
		}
		model.find({}).skip(params.start|0 || 0).limit(limit).exec(toRes(res));
	}];
}

restapi.schema = function(model) {
	return ['/schema', 'get', function(req, res) {
		console.dir(model.schema.paths);
		res.status(200).send(model.schema.paths);
	}];
}

restapi.create = function(model) {
	return ['/', 'post', function(req, res) {
		var body = req.body;
		console.log("create:", model.modelName, body);
		model.create(body, toRes(res));
	}];
}

restapi.read = function(model) {
	return ['/:_id/', 'get', function(req, res) {
		var id = req.params['_id'];
		console.log("read!!!:", model.modelName, id);
		model.findById(id, toRes(res));
	}, false];
}

restapi.update = function(model) {
	return ['/:_id/', 'post', function(req, res) {
		var id = req.params['_id'];
		var body = req.body;
		delete body._id;
		delete body.updatedAt;
		delete body.createdAt;
		console.log("update:", model.modelName, id, body);
		model.findByIdAndUpdate(id, { $set:body }, toRes(res));
	}];
}

restapi.remove = function(model) {
	return ['/:_id/', 'delete', function(req, res) {
			var id = req.params['_id'];
			console.log("delete:", model.modelName, id);
			model.findByIdAndRemove(id, toRes(res));
		},true];
}

exports = module.exports = function(id, model){
	return addRoutes([
		restapi.find(model),
		restapi.schema(model),
		restapi.create(model),
		restapi.read(model),
		restapi.update(model),
		restapi.remove(model),
	]);
}
