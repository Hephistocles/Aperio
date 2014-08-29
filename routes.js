/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global __dirname, module, console, require */
debugger;
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
	res.render("home.jade");
});

app.get('/paper/:id/discussion', function(req, res) {
	api.query("documents", {"id": req.params.id}, function (data) {
		api.query("responses", {"document_id": req.params.id}, function(data2) {
			/*console.log(data2.length);
			for (i=0; i<data2.length; i++) {
				var thisResponse = data2[i];

				api.query("comments", {"response_id": data2[i].id}, function(data3){
					thisResponse.comments = data3;
				});

				// data2[i].comments = comments;
			}*/
			res.render("paper-discussion.jade", {"paper": data[0], "responses": data2});
		});
		
	});
});

app.get('/paper/:id', function(req, res) {
	api.query("documents", {"id": req.params.id}, function (data) {
		if (data === null) {
			res.send("error");
		} else {
			res.render("paper-summary.jade", {"paper": data[0]});
		}
	});
});

app.get('/user/:id', function(req, res) {
	api.query("users", {"id": req.params.id}, function (data) {
		if (data === null) {
			res.send("error");
		} else {
			api.query("documents", {"user_id": req.params.id}, function(data2) {
				res.render("user.jade", {"user": data[0], "publications": data2});
			});
		}
	});

});

app.get('/add', function(req, res) {
	api.post("users", {"user_name": "tlef", "real_name": "Thomas Le Feuvre"}, function(result){
		res.json(result);
	});
});

/* API ROUTES */



app.get(/\/api\/(documents|users|comments|responses|response_types)\/(\d+)/, function(req, res) {

	api.query(req.params[0], {id:req.params[1]}, function(data) {
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

// serve static files in the 'assets' folder directly from the root
app.use('/', express.static(__dirname + '/assets'));