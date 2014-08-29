/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global __dirname, module, console, require */
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
	res.render("home.jade");
});

app.get('/paper/:id/discussion', function(req, res) {
	queryAPI("documents", {"id": req.params.id}, function (data) {
		queryAPI("responses", {"document_id": req.params.id}, function(data2) {
			/*console.log(data2.length);
			for (i=0; i<data2.length; i++) {
				var thisResponse = data2[i];

				queryAPI("comments", {"response_id": data2[i].id}, function(data3){
					thisResponse.comments = data3;
				});

				// data2[i].comments = comments;
			}*/
			res.render("paper-discussion.jade", {"paper": data[0], "responses": data2});
		});
		
	});
});

app.get('/paper/:id', function(req, res) {
	queryAPI("documents", {"id": req.params.id}, function (data) {
		if (data === null) {
			res.send("error");
		} else {
			res.render("paper-summary.jade", {"paper": data[0]});
		}
	});
});

app.get('/user/:id', function(req, res) {
	queryAPI("users", {"id": req.params.id}, function (data) {
		if (data === null) {
			res.send("error");
		} else {
			queryAPI("documents", {"user_id": req.params.id}, function(data2) {
				res.render("user.jade", {"user": data[0], "publications": data2});
			});
		}
	});

});

app.get('/add', function(req, res) {
	res.render("add.jade");
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

app.get(/\/api\/(documents|users|comments|responses|response_types)\/(\d+)/, function(req, res) {

	queryAPI(req.params[0], {
		id: req.params[1]
	}, function(data) {
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
app.get(/\/api\/(documents|users|comments|responses|response_types)\//, function(req, res) {
	queryAPI(req.params[0], req.query, function(data) {
		if (data !== null) {
			res.json(data);
		} else {
			res.send("Error. Sorry!");
		}
	});
});

/* AUTH STUFF */
var passport = require("passport");

// forward authentication requests directly to Google
app.get('/login/', passport.authenticate('google', {
	scope: 'https://www.googleapis.com/auth/userinfo.email'
}));
app.get('/logincallback', passport.authenticate('google', {
	successRedirect: '/login/success',
	failureRedirect: '/login/failure'
}));
app.get("/login/success", function(req, res) {
	res.redirect('/');
});
app.get("/login/failure", function(req, res) {
	res.send("Failed to log in.");
});

// Note: still doesn't seem to work...
app.get('/logout', function(req, res) {
	req.logout();
	req.session.destroy(function() {
		res.redirect('/');
	});
});



// serve static files in the 'assets' folder directly from the root
app.use('/', express.static(__dirname + '/assets'));