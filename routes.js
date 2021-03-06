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
app.use(bodyParser.urlencoded());


// serve an html page on the root url
// we have registered a default views directory (/views) and renderer (ejs) so only "chat.html" is necessary

/* APPLICATION ROUTES */

app.get('/', function(req, res) {
	api.query("documents", {}, function(data){
		if (req.isAuthenticated()) {
			api.query("users", {
				"id": req.session.passport.user.db_id
			}, function(data2) {
				res.render("home.jade", {
					logged_in: req.isAuthenticated(),
					"user": data2[0],
					"documents": data
				});
			});
		} else {
			res.render("home.jade", {
				logged_in: false,
				"documents": data
			});
		}
	});
});

app.get('/paper/:id/discussion', function(req, res) {
	api.dosql("SELECT " +
		// users.picture_url AS picture_url, user_ratings.rating AS user_rating, location, title, u.real_name AS author_name, responses.id AS response_id FROM responses JOIN users ON user_id = users.id JOIN documents ON document_id = documents.id JOIN user_ratings ON users.id = user_ratings.user_id WHERE document_id = 1
		"response_types.name AS response_type, documents.id as document_id, content, responses.response_type AS response_type_id, responses.rating AS response_rating, responses.time_stamp, users.real_name AS real_name," +
		" users.picture_url AS picture_url, u.picture_url AS author_picture_url, user_ratings.rating AS user_rating, location, title, u.real_name AS author_name, responses.id AS response_id " +
		"FROM " +
		"responses " +
		"JOIN " +
		"users ON user_id = users.id " +
		"JOIN " +
		"documents ON document_id = documents.id " +
		"JOIN " +
		"user_ratings ON users.id = user_ratings.user_id " +
		"JOIN users AS u ON documents.user_id=u.id " +
		"JOIN response_types ON response_types.id=responses.response_type " +
		"WHERE " +
		"document_id = ? ORDER BY response_rating DESC, user_rating DESC, time_stamp ASC", [req.params.id], function(responses) {

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
							"responses": responses,
							"logged_in": req.isAuthenticated(),
							"url_int": req.url.search(/discussion$/)
						});
					}
				};
			}
			for (var i = responses.length - 1; i >= 0; i--) {
				responses[i].niceTime = moment(responses[i].time_stamp).format("MMMM Do YYYY");
				api.dosql("SELECT * FROM comments JOIN users ON author_id=users.id WHERE response_id=?", [responses[i].response_id],
					attachComments(responses[i]));
			}
		});
});

app.get('/paper/:id/discussion/:response_type', function(req, res) {
	api.dosql("SELECT " +
		// users.picture_url AS picture_url, user_ratings.rating AS user_rating, location, title, u.real_name AS author_name, responses.id AS response_id FROM responses JOIN users ON user_id = users.id JOIN documents ON document_id = documents.id JOIN user_ratings ON users.id = user_ratings.user_id WHERE document_id = 1
		"response_types.name AS response_type, documents.id as document_id, content, responses.response_type AS response_type_id, responses.rating AS response_rating, responses.time_stamp, users.real_name AS real_name," +
		" users.picture_url AS picture_url, u.picture_url AS author_picture_url, user_ratings.rating AS user_rating, location, title, u.real_name AS author_name, responses.id AS response_id " +
		"FROM " +
		"responses " +
		"JOIN " +
		"users ON user_id = users.id " +
		"JOIN " +
		"documents ON document_id = documents.id " +
		"JOIN " +
		"user_ratings ON users.id = user_ratings.user_id " +
		"JOIN users AS u ON documents.user_id=u.id " +
		"JOIN response_types ON response_types.id=responses.response_type " +
		"WHERE " +
		"document_id = ? AND response_type=? ORDER BY response_rating DESC, user_rating DESC, time_stamp ASC", [req.params.id, req.params.response_type], function(responses) {

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
							"responses": responses,
							"logged_in": req.isAuthenticated(),
							"url_int": req.url.search(/discussion$/)
						});
					}
				};
			}
			for (var i = responses.length - 1; i >= 0; i--) {
				responses[i].niceTime = moment(responses[i].time_stamp).format("MMMM Do YYYY");
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
			api.query("users", {
				"id": data[0].user_id
			}, function(data2) {
				if (data2 === null) {
					res.send("error");
				} else {
					console.log("1 ======" + data[0]);
					console.log("2 ======" + data2[0]);
					res.render("paper-summary.jade", {
						"paper": data[0],
						"user": data2[0],
						"url_int": req.url.search(/discussion$/),
						"logged_in": req.isAuthenticated()
					});
				}
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
					"publications": data2,
					"logged_in": req.isAuthenticated()
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
app.post('/api/responses/', function(req, res) {
	if (req.isUnauthenticated())
		res.send("Not authenticated!");
	api.post('responses', {
		document_id: req.body.document_id,
		content: req.body.response_content,
		user_id: req.session.passport.user.db_id,
		response_type: req.body.response_type
	}, function(data) {
		if (data!==null){
			res.redirect("/paper/" + req.body.document_id + "/discussion");
		} else {
			res.send("error");
		}
	});
});

app.post('/api/comments/', function(req, res) {
	if (req.isUnauthenticated())
		res.send("Not authenticated!");
	var obj = {
		response_id: req.body.response_id,
		comment_text: req.body.comment_content,
		author_id: req.session.passport.user.db_id
	}
	console.log(obj);
	api.post('comments', obj, function(data) {
		if (data!==null){
			res.redirect("/paper/" + req.body.document_id + "/discussion");
		} else {
			res.send("error");
		}
	});
});

app.post('/api/vote/', function(req, res) {
	if (req.isUnauthenticated()) {
		res.json({success:false, error:"not authenticated"});
		return;
	}

	api.vote(req.body.response_id, req.session.passport.user.db_id, req.body.value, function(data) {
		if (data !== null) {
			res.json({success:true});
		} else {
			res.json({success:false});
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
	if (req.isUnauthenticated()) {
		res.redirect('/');
	} else {
		res.redirect('/user/' + req.session.passport.user.db_id);
	}
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