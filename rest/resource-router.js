const passport = require('passport');
const restapi = require('./restapi');

//var rest = {};

/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
/*
rest.toRes = function (res, status=200) {
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
*/

// ルートをたくさん追加
// http request mmethod get,post,delete ...
module.exports = function(router, params) {

	for (let item of params) {

		if (item[3] !== restapi.role.public) { // role もしも、セキュリティが必要なら
			router[item[1]](item[0], passport.authenticate(['jwt'], { session: false }), item[2]);
		} else {
			router[item[1]](item[0], item[2]);
		}
		console.log("register:",item[1], item[0]);
		
		
	}

};

