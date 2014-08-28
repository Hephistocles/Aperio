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
app.get('/', function(req, res) {
	res.render("index.jade");
});

app.get('/paper/:id/discussion', function(req, res) {
	res.render("paper-discussion.jade");
});


app.get('/paper', function(req, res) {
	res.render("paper.jade");
});
app.get('/paper/:id', function(req, res) {
	res.render("paper.jade");
});

app.get('/user', function(req, res) {
	res.render("user.jade", user);
});

/* API ROUTES */

function queryAPI(objectType, queryObj, callback) {
	var connection = getMySQLConn();
	objectType = connection.escapeId(objectType);

	var condition = "";
	var conjunction = " WHERE ";
	for (var key in queryObj) {
		if (queryObj.hasOwnProperty(key)) {
			condition += conjunction + connection.escapeId(key) + "=" + connection.escape(queryObj[key]);
			conjunction = " AND ";
		}
	}
	console.log('SELECT * from ' + objectType + ' ' + condition + ' LIMIT 10');
	connection.query(
		'SELECT * from ' + objectType + ' ' + condition + ' LIMIT 10',
		function(err, rows) {
			if (err) {
				callback(null);
			}
			callback(rows);
		});
}

app.get(/\/api\/(documents|users|comments|responses)\/(\d+)/, function(req, res) {
	// var connection = getMySQLConn();
	// connection.query(
	// 	'SELECT * from ?? WHERE id=?', [req.params[0], req.params[1]],
	// 	function(err, rows) {
	// 		if (err) {
	// 			console.log(err);
	// 			return null;
	// 		}
	// 		res.json(rows);
	// 	});

	queryAPI(req.params[0], {id:req.params[1]}, function(data) {
		if (data !== null) {
			if (data.length > 0)
				res.json(data[0]);
			else 
				res.json([]);
		} else {
			res.send("Error. Sorry!");
		}
	});
});
app.get(/\/api\/(documents|users|comments|responses)\//, function(req, res) {
	queryAPI(req.params[0], req.query, function(data) {
		if (data !== null) {
			res.json(data);
		} else {
			res.send("Error. Sorry!");
		}
	});
});

// serve static files in the 'assets' folder directly from the root
app.use('/', express.static(__dirname + '/assets'));