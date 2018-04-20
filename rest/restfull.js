'use strict';
const passport = require('passport');

const toRes = require('./resource-router').toRes;
const addRoutes = require('./resource-router').addRoutes;

exports = module.exports = function(id_field_name, model){
	return addRoutes([
		// find
		['/', 'get', function(req, res) {
			console.log("user:",req.user);
			var params = req.query;
			console.log("list:",params);
			var limit = Math.max(1, Math.min(50, params.limit|0 || 10));

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
		// create new
		['/', 'post', function(req, res) {
			console.log("create:",req.body);
			model.create(req.body, toRes(res));
		}],
		// read
		['/:_id/', 'get', function(req, res) {
			console.log("get user:",req.user);
			var params = req.params;
			console.log("read:",params);
			model.findById(params[id_field_name], toRes(res));
		}, false],
		// update
		['/:_id/', 'post', function(req, res) {
			var params = req.params;
			var body = req.body;
			console.log("update:",params, body);
			delete body._id;
			model.findByIdAndUpdate(params[id_field_name], { $set:body }, toRes(res));
		}],
		// delete
		['/:_id/', 'delete', function(req, res) {
			var params = req.params;
			console.log("delete:",params);
			model.findByIdAndRemove(params[id_field_name], toRes(res));
		},true],
	]);
}
