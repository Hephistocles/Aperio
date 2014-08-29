/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global __dirname, module, console, require */
var app = module.parent.exports.app;
var express = module.parent.exports.express;
var getMySQLConn = module.parent.exports.getMySQLConn;
var api = module.parent.exports.api;
var bodyParser = require('body-parser');

// use body parser to interpret json
app.use(bodyParser.json());


// serve an html page on the root url
// we have registered a default views directory (/views) and renderer (ejs) so only "chat.html" is necessary

/* APPLICATION ROUTES */

app.get('/', function(req, res) {
	console.log("ROUTES 19", req.session.passport.user);
	api.query("users", {"id": req.session.passport.user.db_id}, function(data){
		res.render("home.jade", {
			logged_in: req.isAuthenticated(),
			"user": data[0]
		});
	});
	
});

app.get('/paper/:id/discussion', function(req, res) {
	api.query("documents", {
		"id": req.params.id
	}, function(data) {
		api.query("responses", {
			"document_id": req.params.id
		}, function(data2) {
			console.log(data2.length);

			var commentsToFind = data2.length;

			function attachComments(response) {
				return function(comments) {
					response.comments = comments;
					commentsToFind--;
					if (commentsToFind < 1) {
						res.render("paper-discussion.jade", {
							"paper": data[0],
							"responses": data2.sort(function(a,b){return parseFloat(b.rating) - parseFloat(a.rating)})
						});
					}
				};
			}

			for (var i = 0; i < data2.length; i++) {
				api.query("comments", {
					"response_id": data2[i].id
				}, attachComments(data2[i]));
			}

		});

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

app.get('/vote', function(req,res){
	api.vote(1, 1, 1, function(result){
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