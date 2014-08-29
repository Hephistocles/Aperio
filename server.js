/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global __dirname, require, module */

var express = require("express");
var session = require("express-session");
var app = express();
var config = require("./config");

// make the app and express variables visible from outside the module. 
module.exports.app = app;
module.exports.express = express;
module.exports.session = session;

// set up all the passport.js stuff
require("./auth");

// prepare a function to connect to the mysql database for us
var mysql = require('mysql');
module.exports.getMySQLConn = function() {
	// connect to the database
	return mysql.createConnection({
		host: config.dbhost,
		user: config.dbuser,
		password: config.dbpass,
		database: config.db,
		connectTimeout: 100000
	});
};

// set the default directory for templated pages
app.set("views", __dirname + "/views");

// I have put routing code in another file for tidiness. The .js suffix is implicit
require("./routes");

// any requested page not routed by the above should result in a 404
app.get('/*', function(req, res) {
	res.send("404 Page not found");
});


// listen on port 8000
app.listen(config.port);