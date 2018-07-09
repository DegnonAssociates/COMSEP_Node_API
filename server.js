// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express           = require('express');        // call express
var app               = express();                 // define our app using express
var bodyParser        = require('body-parser');
var expressValidator  = require('express-validator');
var morgan            = require('morgan');
var jwt               = require('jsonwebtoken');
var settings          = require('./settings');
var db                = require('./core/db');
var httpMsgs          = require('./core/httpMsgs');
var member            = require('./app/controllers/member');
var activity          = require('./app/controllers/activity');
var activityCode      = require('./app/controllers/activityCode');
var authn             = require('./app/controllers/authenticate');
var reset             = require('./app/controllers/reset');
var committee         = require('./app/controllers/committee');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(expressValidator());
app.use(morgan('dev'));


var port = process.env.PORT || settings.webPort;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {
    res.json({ message: 'Degnon Associates Member Interface API' });   
});

// Authenticate User (POST http://localhost:3000/api/authenticate)
router.post('/authenticate', function (req, res) {
	authn.getAuthn(req, res);
});

// Get Reset User Token (POST http://localhost:3000/api/reset)
router.post('/reset', function (req, res) {
	reset.getReset(req, res);
});

// Get Committee list (POST http://localhost:3000/committees)
router.get('/committees/:positionCode', function (req, res) {
	var positionCodePatt = "[0-9]+";
	var patt = new RegExp("/committees/" + positionCodePatt);
	if (patt.test(req.url)) {
		patt = new RegExp(positionCodePatt);
		var positionCode = patt.exec(req.url);
		committee.get(req, res, positionCode);
	} else {
		httpMsgs.show404(req, res);
	}
});

// check post, url params, or header for token
function valToken(req, res) {

	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	

	// decode token
	if (token) {
		// verify secret and check exp
		jwt.verify(token, settings.secret, function (err, decoded) {
			if (err) {
				httpMsgs.show400(req, res);
			} else {
				// authn passed, save to request for use in other routes
				req.decoded = decoded;

			}
		});
	} else {
		if( req.headers['authorization'] ){
			authn.getAuthn(req, res);
		} else {
			// if no token or auth is passed return an error
			httpMsgs.show401(req, res);
		}
		
	}

}
// member GET all POST routes
	router.route('/members')
		.get(function (req, res) {
			valToken(req, res);
			member.getList(req, res);
		})
		.post(function (req, res) { 
			valToken(req, res);
			member.add(req, res);
	});


	// member GET one PUT DELETE routes
	router.route('/members/:memberId')
		.get(function (req, res) { 
			valToken(req, res);
			var memIdPatt = "[0-9]+";
			var patt = new RegExp("/members/" + memIdPatt);
			if (patt.test(req.url)) {
				patt = new RegExp(memIdPatt);
				var memberId = patt.exec(req.url);
				member.get(req, res, memberId);
			} else {
				httpMsgs.show404(req, res);
			}
		})
		.put(function (req, res) {
			valToken(req, res);
			var memIdPatt = "[0-9]+";
			var patt = new RegExp("/members/" + memIdPatt);
			if (patt.test(req.url)) {
				patt = new RegExp(memIdPatt);
				var memberId = patt.exec(req.url);
				member.update(req, res, memberId);
			} else {
				httpMsgs.show404(req, res);
			}
		})
		.post(function (req, res) {
			valToken(req, res);
			var memIdPatt = "[0-9]+";
			var patt = new RegExp("/members/" + memIdPatt);
			if (patt.test(req.url)) {
				patt = new RegExp(memIdPatt);
				var memberId = patt.exec(req.url);
				member.update(req, res, memberId);
			} else {
				httpMsgs.show404(req, res);
			}
		})
		.delete(function (req, res) {
			valToken(req, res);
			member.delete(req, res);
	});

	// activities GET all POST routes
	router.route('/activities')
		.get(function (req, res) {
			valToken(req, res);
			activity.getList(req, res);
		})
		.post(function (req, res) { 
			valToken(req, res);
			activity.add(req, res);
	});

	// activities GET one PUT DELETE routes
	router.route('/activities/:memberId')
		.get(function (req, res) { 
			valToken(req, res);
			var memIdPatt = "[0-9]+";
			var patt = new RegExp("/activities/" + memIdPatt);
			if (patt.test(req.url)) {
				patt = new RegExp(memIdPatt);
				var memberId = patt.exec(req.url);
				activity.get(req, res, memberId);
			} else {
				httpMsgs.show404(req, res);
			}
		})
		.put(function (req, res) {
			valToken(req, res);
			activity.update(req, res, memberId);
		})
		.delete(function (req, res) {
			valToken(req, res);
			activity.delete(req, res);
	});

	// activityCode GET all POST routes
	router.route('/activityCodes')	
		.get(function (req, res) {
			valToken(req, res);
			activityCode.getList(req, res);
		})
		.post(function (req, res) { 
			valToken(req, res);
			activityCode.add(req, res);
	});

	// activityCode GET one PUT DELETE routes
	router.route('/activityCodes/:activityId')
		.get(function (req, res) { 
			valToken(req, res);
			var activityIdPatt = "[0-9]+";
			var patt = new RegExp("/activityCode/" + activityIdPatt);
			if (patt.test(req.url)) {
				patt = new RegExp(activityIdPatt);
				var activityId = patt.exec(req.url);
				activity.get(req, res, activitysId);
			} else {
				httpMsgs.show404(req, res);
			}
		})
		.put(function (req, res) {
			valToken(req, res);
			activityCode.update(req, res);
		})
		.delete(function (req, res) {
			valToken(req, res);
			activityCode.delete(req, res);
	});





// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api/v1', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Started listening at ' + port);


