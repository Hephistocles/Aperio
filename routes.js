/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global __dirname, module, console, require */
var app = module.parent.exports.app;
var express = module.parent.exports.express;
var getMySQLConn = module.parent.exports.getMySQLConn;
var api = module.parent.exports.api;
var bodyParser = require('body-parser');
var moment = require('moment');

// use body parser to interpret json
app.use(bodyParser.json());


// serve an html page on the root url
// we have registered a default views directory (/views) and renderer (ejs) so only "chat.html" is necessary

/* APPLICATION ROUTES */

app.get('/', function(req, res) {
	console.log("ROUTES 19", req.session.passport.user);
	api.query("users", {
		"id": req.session.passport.user.db_id
	}, function(data) {
		res.render("home.jade", {
			logged_in: req.isAuthenticated(),
			"user": data[0]
		});
	});

});

app.get('/paper/:id/discussion', function(req, res) {
	api.query("documents", {
		"id": req.params.id
	}, function(documents) {
		api.query("responses", {
			"document_id": req.params.id
		}, function(responses) {

			// we need to find user and commentlist for each response
			var itemsToFind = responses.length * 2;

			function tryToFinish() {
				itemsToFind--;
				if (itemsToFind < 1) {
					res.render("paper-discussion.jade", {
						"paper": documents[0],
						"responses": responses
					});
				}
			}

			function attachComments(response) {
				return function(comments) {
					response.comments = comments;
					tryToFinish();
				};
			}

			function attachUser(response) {
				return function(user) {
					response.user = user[0];
					tryToFinish();
				};
			}

			for (var i = 0; i < responses.length; i++) {
				api.query("comments", {
					"response_id": responses[i].id
				}, attachComments(responses[i]));
				api.query("users", {
					"id": responses[i].user_id
				}, attachUser(responses[i]));
			}

		});

	});
});
app.get('/paper/:id/discussion2', function(req, res) {
	api.dosql("SELECT * FROM responses JOIN users ON user_id=users.id JOIN documents ON document_id=documents.id WHERE document_id=?", [req.params.id], function(responses) {

		var itemsToFind = responses.length;

		function attachComments(response) {
			return function(comments) {
				response.comments = comments;
				for (var i = response.comments.length - 1; i >= 0; i--) {
					response.comments[i].niceTime = moment(response.comments[i].time_stamp).fromNow();
				}

				itemsToFind--;
				if (itemsToFind < 1) {
					res.render("paper-discussion.jade", {
						"paper": responses[0],
						"responses": responses
					});
				}
			};
		}
		for (var i = responses.length - 1; i >= 0; i--) {

			api.dosql("SELECT * FROM comments JOIN users ON author_id=users.id WHERE response_id=?", [responses[i].id],
				attachComments(responses[i]));
		}
	});
});

app.get('/paper/:id', function(req, res) {
	api.query("documents", {
		"id": req.params.id
	}, function(data) {
		if (data === null) {
			res.send("error");
		} else {
			res.render("paper-summary.jade", {
				"paper": data[0]
			});
		}
	});
});

app.get('/user/:id', function(req, res) {
	api.query("users", {
		"id": req.params.id
	}, function(data) {
		if (data === null) {
			res.send("error");
		} else {
			api.query("documents", {
				"user_id": req.params.id
			}, function(data2) {
				res.render("user.jade", {
					"user": data[0],
					"publications": data2
				});
			});
		}
	});

});

app.get('/add', function(req, res) {
	api.post("users", {
		"user_name": "tlef",
		"real_name": "Thomas Le Feuvre"
	}, function(result) {
		res.json(result);
	});
});

/* API ROUTES */



app.get(/\/api\/(documents|users|comments|responses|response_types)\/(\d+)/, function(req, res) {
	api.query(req.params[0], {
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
	api.query(req.params[0], req.query, function(data) {
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

app.get('/logout', function(req, res) {
	req.logout();
	req.session.destroy(function() {
		res.redirect('/');
	});
});


// serve static files in the 'assets' folder directly from the root
app.use('/', express.static(__dirname + '/assets'));