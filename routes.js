/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global __dirname, module */

var app = module.parent.exports.app;
var express = module.parent.exports.express;

// serve an html page on the root url
// we have registered a default views directory (/views) and renderer (ejs) so only "chat.html" is necessary
app.get('/', function(req, res) {
	res.render("home.jade");
});

// serve static files in the 'assets' folder directly from the root
app.use('/', express.static(__dirname + '/assets'));