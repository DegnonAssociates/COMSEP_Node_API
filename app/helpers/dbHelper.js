// dbHelper.js

var db = require ("../../core/db");
var settings = require("../../settings");


exports.getCount = function (table) {
	var cSql = "SELECT count(*) as numRows FROM " + table;

	return new Promise(function(resolve, reject) {
		db.executeSql(cSql, function(results, err) {
			if (err){
				console.log(err);
				reject(err);
			} else {
				resolve(results[0].numRows);
			}
			
		});
	});
}