'use strict';
const passport = require('passport');
const addRoutes = require('./resource-router').addRoutes;

var toRes = function (res, status=200) {
	return (err, thing) => {
		if (err) {
			console.log("err:", err);
			return res.status(500).send(err);
		}
		if (thing && typeof thing.toObject==='function') {
			thing = thing.toObject();
		}
    res.set('X-Total-Count', 50);
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    
		res.status(status).send(thing);

	};
}

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
		console.log("toRes",toRes);
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

restapi.role = {
	public: 'PUBLIC',
	guest:  'GUEST',
	user:   'USER',
	admin:  'ADMIN',
	root:   'ROOT',
};

exports = module.exports = restapi;
