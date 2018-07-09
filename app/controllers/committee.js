// member.js

var db        = require("../../core/db");
var dbHelper  = require("../helpers/dbHelper");
var httpMsgs  = require("../../core/httpMsgs");
var util      = require("util");
var settings  = require('../../settings');
var expValidate  = require('express-validator');


// We are only going to be querying the list based on our request. This request does not require authentication.
exports.get = function (req, res, positionCode) {
	var sql = settings.activitySql;
	sql += "WHERE [positionCode] = " + positionCode + " AND termExp >= year(getDate()) ORDER BY Chairman, CoChair, TermExp";

	db.executeSql(sql, function(data, err) {
		if(err){
			httpMsgs.show500(req, res, err);
		} else {
			httpMsgs.sendJson(req, res, data);
		}
	});
};



