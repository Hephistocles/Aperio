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
	if (req.isAuthenticated()) {
		api.query("users", {
			"id": req.session.passport.user.db_id
		}, function(data) {
			res.render("home.jade", {
				logged_in: req.isAuthenticated(),
				"user": data[0]
			});
		});
	} else {
		res.render("home.jade", {
			logged_in: false
		});
	}

});

app.get('/paper/:id/discussion', function(req, res) {
	api.dosql("SELECT " +
		"content, responses.rating AS response_rating, time_stamp, real_name, picture_url, user_ratings.rating AS user_rating, location, title, responses.id AS response_id " +
		"FROM " +
		"responses " +
		"JOIN " +
		"users ON user_id = users.id " +
		"JOIN " +
		"documents ON document_id = documents.id " +
		"JOIN " +
		"user_ratings ON users.id = user_ratings.user_id " +
		"WHERE " +
		"document_id = ?", [req.params.id], function(responses) {

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

				api.dosql("SELECT * FROM comments JOIN users ON author_id=users.id WHERE response_id=?", [responses[i].response_id],
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

app.get('/vote', function(req, res) {
	api.vote(1, 1, 1, function(result) {
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