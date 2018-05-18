/*
WPからのexport.csvをmongodbに取り込む

タイムゾーンの設定
sudo timedatectl set-timezone Asia/Tokyo
timedatectl

インストール＆実行
npm install csv
node ./tools/studentcsv.js

テスト用のdbを削除
mongo
use temp
db.docs.drop();
db.docs.find();

*/

var mongoose = require('mongoose');
//var dbname = "mongodb://localhost/temp";
var dbname = "mongodb://localhost/kids2020";
var groupId = "5afd388400c75f64da9ca240";

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


let input = fs.readFileSync('./tools/studentcsv.csv');
parse(input, {delimiter: ';', comment: '#'}, function(err, output){
	var docArray = [];
	for (item of output) {
		var data = {
			name: item[2],
			fullname: item[1],
			furigana: item[2],
			email: item[9],
			tel: item[10],
			createdAt: item[14],
			memo: item[18],
			autho: "GUEST",
			mainrole: "STUDENT",
		};
		//docArray.push(new model(data));
		docArray.push(data);
	  //console.log(data);
	}

	var total = docArray.length;

	function saveStudent(parent, student) {
		//子ども書込み
		var doc = new model(student);
	  doc.save(function(err, saved){
	    if (err) {console.log(err);};//handle error
			// 参加申込
			doc.ownerId = parent._id;
			doc.save(function(err) {
				var d = {
					name: doc.fullname + " 5/20",
					createdAt: doc.createdAt,
					memberId: doc._id,
					ownerId: parent._id,
					groupId: groupId,
					status:"APPROVED",
				}
				newjoin = new join(d);
				newjoin.save(function(err, saved){

					console.log("RESULT:", total, saved.name);

			    if (err) {console.log(err);};//handle error
					//console.log("RESULT:", saved);
			    if (--total){
						 saveAll();	//次のデータ
					} else {
						db.close();	// all saved here
					}
				})
			})
	  })
	}

	function saveAll(){
	  var parent = docArray.pop();
		var student = Object.assign({}, parent);
		parent.fullname = student.fullname + "の保護者";
		parent.name = parent.fullname;
		parent.mainrole = "PARENT";
		delete student.email;
		delete student.tel;
		// 親検索
		model.findOne({email: parent.email}, function(err, result) {
			if (err || !result) {
				// 親の書き込み
				var doc = new model(parent);
				doc.ownerId = doc._id;
				doc.save(function(err, saved){
					// 子どもの書き込み
					saveStudent(doc, student);
				});
			} else {
				// 子どもの書き込み
				saveStudent(result, student);
			}
		});
	}
	saveAll();
});
