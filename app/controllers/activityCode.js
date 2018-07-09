// activityCode.js

var db        = require("../../core/db");
var dbHelper  = require("../helpers/dbHelper");
var httpMsgs  = require("../../core/httpMsgs");
var util      = require("util");
var settings  = require('../../settings');
var expValidate  = require('express-validator');

exports.getList = function (req, res) {
	try {

		var numRows     // number of records in lookup table;

		dbHelper.getCount("[Activity Codes]")    // first get records in lookup table
		.then(function(result, err) {
			if (err) {
				console.log(err);
				numRows = 0;
			} else {
				numRows = result;	
			}
			
		})
		.then(function () { 
			var page = parseInt(req.query.page, 10) || 1;  // page number passed in URL query string
			var numPerPage  = parseInt(settings.defaultSearchLimit);      // items per page
			var offset = (page - 1) * numPerPage;               // start row			      
			var numPages = Math.ceil(numRows / numPerPage) // max pages available
			
			// console.log(" Page: " + page + "\n Num per page: " + numPerPage + "\n NumRows: " + numRows + " \n numPages: " + numPages);			
		
			// throw error is page requested is too large
			if (page > numPages) {
				var err = ("Page " + page + " exceeds available limit of " + numPages + " pages");
				httpMsgs.show500(req, res, err);
			} else {
				var sql = settings.activityCodeSql;

				sql += "ORDER BY [PositionCode] OFFSET " + offset + " ROWS FETCH NEXT " + numPerPage + " ROWS ONLY";
				db.executeSql(sql, function(data, err) {
					if(err){
						httpMsgs.show500(req, res, err);
					} else {
						httpMsgs.sendJson(req, res, data);
					}
				});
			}
		});
		
	}
	catch (ex) {
		httpMsgs.show500(req, res, err);
		console.log(ex);
		
	}
};

exports.get = function (req, res, activityId) {
	var sql = settings.activityCodeSql;
	sql += "WHERE PositionCode = " + activityId;

	db.executeSql(sql, function(data, err) {
		if(err){
			httpMsgs.show500(req, res, err);
		} else {
			httpMsgs.sendJson(req, res, data);
		}
	});
};

exports.add = function (req, res) {
	try {
		if(!req.body) throw new Error("Input not valid");
		var data = req.body;
		if (data) {
			if(!data.activityName) throw new Error("activityName not provided");

			var sql = "INSERT INTO [Activity Codes] (Position) VALUES ";
			sql += util.format("('%s')", data.activityName);
			db.executeSql(sql, function (data, err) {
				if (err) {
					httpMsgs.show500(req, res, err);
				} else {
					httpMsgs.send200(req, res);
				}
			});
		}
		else {
			throw new Error("Input not valid");
		}
	}
	catch (ex) {
		httpMsgs.show500(req, res, ex);
	}
};

exports.update = function (req, res) {
	try {
		if(!req.body) throw new Error("Input not valid");
		var data = req.body;

		if (data) {

			if(!data.activityCode) throw new Error("activityCode not provided");

			var sql = "UPDATE [Activity Codes] SET";

			var isDataProvided = false;


			if(data.activityName) {
				sql += " position = '" + data.activityName + "',";
				isDataProvided = true;
			}

			sql = sql.slice(0, -1); //remove last comma
			sql += "WHERE PositionCode = " + data.activityName;


			db.executeSql(sql, function (data, err) {
				if (err) {
					httpMsgs.show500(req, res, err);
				} else {
					httpMsgs.send200(req, res);
				}
			});
		}
		else {
			throw new Error("Input not valid");
		}
	}
	catch (ex) {
		httpMsgs.show500(req, res, ex);
	}
};

exports.delete = function (req, res) {
	try {
		if(!req.body) throw new Error("Input not valid");
		var data = req.body;
		if (data) {

			if(!data.activityCode) throw new Error("activityCode not provided");

			var sql = "DELETE FROM Activities";
			
			sql += "WHERE positionCode = " + data.activityCode;

			db.executeSql(sql, function (data, err) {
				if (err) {
					httpMsgs.show500(req, res, err);
				} else {
					httpMsgs.send200(req, res);
				}
			});
		}
		else {
			throw new Error("Input not valid");
		}
	}
	catch (ex) {
		httpMsgs.show500(req, res, ex);
	}
};