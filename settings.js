// settings.js

exports.dbConfig = {
	user:     "comsepadmin",
	password: "comsepadminpwd",
	server:   "degnonsql2",
	database: "COMSEP",
	port: 1433
};

exports.webPort = 3000;
exports.httpMsgsFormat = "JSON";

exports.memberSql = "SELECT [Member ID] as memberId, First_Name as firstName, Last_Name as lastName, degrees as degree, title as academicTitle, org as institution, bus_phone as busPhone, email, address, city, state, zip, country, fax, membertype, dues_year as duesYear, webAccess FROM Main ";
exports.activitySql = "SELECT a.[Member ID] as memberId, a.positionCode, a.memYear, a.chairman, a.termExp, a.activityNote, m.First_Name	as firstName, m.Last_Name as lastName, m.degrees, m.email FROM Activities a INNER JOIN Main m ON a.[Member ID] = m.[Member ID]";
exports.activityCodeSql = "SELECT * FROM [Activity Codes] ";
exports.defaultSearchLimit = 25;

exports.secret = "2c1b1c0e-838f-11e8-adc0-fa7ae01bbebc";