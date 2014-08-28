/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global __dirname, module, console, require */
debugger;
var app = module.parent.exports.app;
var express = module.parent.exports.express;
var getMySQLConn = module.parent.exports.getMySQLConn;

var bodyParser = require('body-parser');

// use body parser to interpret json
app.use(bodyParser.json());


// serve an html page on the root url
// we have registered a default views directory (/views) and renderer (ejs) so only "chat.html" is necessary

/* APPLICATION ROUTES */

app.get('/', function(req, res) {
	res.render("index.jade");
});

app.get('/paper/:id/discussion', function(req, res) {
	res.render("paper-discussion.jade");
});

app.get('/paper/:id', function(req, res) {
	res.render("paper-summmary.jade");
});

app.get('/user/:id', function(req, res) {
	res.render("user.jade");
});

/* API ROUTES */

app.get(/\/api\/(documents|users|comments|responses)\/(\d+)/, function(req, res) {
	var connection = getMySQLConn();
	connection.query(
		'SELECT * from ?? WHERE id=?',
		[req.params[0], req.params[1]],
		function(err, rows) {
			if (err)
				return console.log(err);
			res.json(rows);
		});
});
app.get('/api/papers/', function(req, res) {
	var connection = getMySQLConn();
	var condition = "";
	var conjunction = "";
	if (req.query.id || req.query.userid)
		condition = "WHERE";
	if (req.query.id) {
		condition += " id=" + connection.escape(req.query.id);
		conjunction = " AND ";
	}
	if (req.query.userid) {
		condition += conjunction + " documents_user=" + connection.escape(req.query.userid);
	}
	connection.query(
		'SELECT * from documents ' + condition + ' LIMIT 10',
		function(err, rows) {
			if (err) {
				res.send("Error: " + err);
				return console.log(err);
			}
			res.json(rows);
		});
});

// serve static files in the 'assets' folder directly from the root
app.use('/', express.static(__dirname + '/assets'));