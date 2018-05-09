/*

タイムゾーンの設定
sudo timedatectl set-timezone Asia/Tokyo

インストール＆実行
npm install csv
node ./tools/staffcsv.js

テスト用のdbを削除
mongo
use temp
db.docs.drop();
db.docs.find();

WPからのexport.csvをmongodbに取り込む

*/

var mongoose = require('mongoose');
//var dbname = "mongodb://localhost/temp";
var dbname = "mongodb://localhost/kids2020";
mongoose.connect(dbname, {}, function(error) {
  if (error) {
    console.log (">sudo service mongod start"); 
    console.log (error); // Check error in initial connection. There is no 2nd param to the callback.
  }
 });
	let db = mongoose.connection;

const model =require('../models/user'); // User model
const join =require('../models/join'); // User model
const fs = require('fs');
var parse = require('csv-parse');


let input = fs.readFileSync('./tools/export.csv');
parse(input, {delimiter: ';', comment: '#'}, function(err, output){
	var docArray = [];
	for (item of output) {
		var data = {
			name: item[1],
			fullname: item[1],
			furigana: item[2],
			email: item[9],
			tel: item[10],
			createdAt: item[14],
			memo: item[18],
			autho: "GUEST",
			mainrole: "STAFF",
		};
		docArray.push(new model(data));
	  //console.log(data);
	}

	var total = docArray.length
	  , result = []
	;

	function saveAll(){
	  var doc = docArray.pop();

	  doc.save(function(err, saved){
	    if (err) {console.log(err);};//handle error
			doc.ownerId = doc._id;
			doc.save(function(err) {
		    //result.push(saved[0]);
				var d = {
					name: doc.fullname + " 5/13",
					createdAt: doc.createdAt,
					memberId: doc._id,
					ownerId: doc._id,
					groupId: "5af17d2462854b529f627e6d",
					status:"APPROVED",
				}
				newjoin = new join(d);
				newjoin.save(function(err, saved){
			    if (err) {console.log(err);};//handle error
				console.log("RESULT:", saved);
			    if (--total){
						 saveAll();
					} else {
						db.close();	// all saved here
					}
				})
			})
	  })
	}
	saveAll();
});
