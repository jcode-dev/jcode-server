'use strict';
const passport = require('passport');

const toRes = require('./resource-router').toRes;
const addRoutes = require('./resource-router').addRoutes;

exports = module.exports = function(id_field_name, model){
	return addRoutes([
		// find
		['/', 'get', function(req, res) {
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
		}],
		// schema
		['/schema', 'get', function(req, res) {
			console.dir(model.schema.paths);
			res.status(200).send(model.schema.paths);
		}],
		// create new
		['/', 'post', function(req, res) {
			var body = req.body;
			console.log("create:", model.modelName, body);
			model.create(body, toRes(res));
		}],
		// read
		['/:_id/', 'get', function(req, res) {
			var id = req.params[id_field_name];
			console.log("read:", model.modelName, id);
			model.findById(id, toRes(res));
		}, false],
		// update
		['/:_id/', 'post', function(req, res) {
			var id = req.params[id_field_name];
			var body = req.body;
			delete body._id;
			console.log("update:", model.modelName, id, body);
			model.findByIdAndUpdate(id, { $set:body }, toRes(res));
		}],
		// delete
		['/:_id/', 'delete', function(req, res) {
			var id = req.params[id_field_name];
			console.log("delete:", model.modelName, id);
			model.findByIdAndRemove(id, toRes(res));
		},true],
	]);
}
