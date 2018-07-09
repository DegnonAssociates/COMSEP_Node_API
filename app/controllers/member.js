// member.js

var db        = require("../../core/db");
var dbHelper  = require("../helpers/dbHelper");
var httpMsgs  = require("../../core/httpMsgs");
var util      = require("util");
var settings  = require('../../settings');
var expValidate  = require('express-validator');

exports.getList = function (req, res) {
	try {

		var numRows     // number of records in lookup table;

		dbHelper.getCount("main")    // first get records in lookup table
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
				var sql = settings.memberSql;

				sql += "ORDER BY [member id] OFFSET " + offset + " ROWS FETCH NEXT " + numPerPage + " ROWS ONLY";
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

exports.get = function (req, res, memberId) {
	var sql = settings.memberSql;
	sql += "WHERE [Member Id] = " + memberId;

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
			var sql = "INSERT INTO Main (First_Name, Last_Name, email) VALUES ";
			sql += util.format("('%s', '%s', '%s')", data.firstName, data.lastName, data.email);
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

exports.update = function (req, res, memberId) {
	try {
		if(!req.body) throw new Error("Input not valid");
		var data = req.body;

		if (data) {
			
			if(memberId != req.decoded.memberId && req.decoded.admin != 'Council'){
				httpMsgs.show401(req, res);
			} else {	
				var sql = "UPDATE Main SET";

				var isDataProvided = false;
				if(data.firstName) {
					sql += " First_Name = '" + data.firstName + "',";
					isDataProvided = true;
				}

				if(data.middleName) {
					sql += " Middle_Nam = '" + data.middleName + "',";
					isDataProvided = true;
				}

				if(data.lastName) {
					sql += " Last_Name = '" + data.lastName + "',";
					isDataProvided = true;
				}

				if(data.degree) {
					sql += " Degree = '" + data.degree + "',";
					isDataProvided = true;
				}

				if(data.academicTitle) {
					sql += " academicti = '" + data.academicTitle + "',";
					isDataProvided = true;
				}

				if(data.department) {
					sql += " Department = '" + data.department + "',";
					isDataProvided = true;
				}

				if(data.institution) {
					sql += " org = '" + data.institution + "',";
					isDataProvided = true;
				}

				if(data.address) {
					sql += " address = '" + data.address + "',";
					isDataProvided = true;
				}

				if(data.city) {
					sql += " city = '" + data.city + "',";
					isDataProvided = true;
				}

				if(data.state) {
					sql += " state = '" + data.state + "',";
					isDataProvided = true;
				}

				if(data.zip) {
					sql += " zip = '" + data.zip + "',";
					isDataProvided = true;
				}

				if(data.country) {
					sql += " country = '" + data.country + "',";
					isDataProvided = true;
				}

				if(data.busPhone) {
					sql += " telephone = '" + data.busPhone + "',";
					isDataProvided = true;
				}

				if(data.fax) {
					sql += " fax = '" + data.fax + "',";
					isDataProvided = true;
				}

				if(data.email) {
					sql += " Email = '" + data.email + "',";
					isDataProvided = true;
				}

				if(data.nonInstitutionalEmail) {
					sql += " emai_other = '" + data.nonInstitutionalEmail + "',";
					isDataProvided = true;
				}

				if(data.updated) {
					sql += " Updated = '" + data.updated + "',";
					isDataProvided = true;
				}

				if(data.password) {
					sql += " Web_Password = '" + data.password + "',";
					isDataProvided = true;
				}

				if(data.webAccess) {
					sql += " webAccess = '" + data.webAccess + "',";
					isDataProvided = true;
				}

				sql = sql.slice(0, -1); //remove last comma
				sql += "WHERE [member id] = " + memberId;
				console.log(sql);

				if(isDataProvided){
					db.executeSql(sql, function (data, err) {
						if (err) {
							httpMsgs.show500(req, res, err);
						} else {
							httpMsgs.send200(req, res);
						}
					});
				} else{
					httpMsgs.show400(req, res, ex);
				}
			}
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

			if(!data.memberId) throw new Error("memberId not provided");

			if(data.memberId !== req.decoded.memberId && req.decoded.admin !== 'Council'){
				httpMsgs.show401(req, res);
			} else {

				var sql = "DELETE FROM Main";
				
				sql += "WHERE [member id] = " + data.memberId;

				db.executeSql(sql, function (data, err) {
					if (err) {
						httpMsgs.show500(req, res, err);
					} else {
						httpMsgs.send200(req, res);
					}
				});
			}
		}
		else {
			throw new Error("Input not valid");
		}
	}
	catch (ex) {
		httpMsgs.show500(req, res, ex);
	}
};

