/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global require, module */

var passport = require("passport");
var app = module.parent.exports.app;
var session = module.parent.exports.session;
var api = module.parent.exports.api;
var config = module.parent.exports.config;

app.use(session({
	secret: 'chris is the best (no secret)'
}));
app.use(passport.initialize());
app.use(passport.session());
var passport = require("passport");
var google_strategy = require('passport-google-oauth').OAuth2Strategy;
var portstring = (config.port === 80) ? '' : ':' + config.port;
passport.use(new google_strategy({
		clientID: '308460185536-40t5uojh8phm77gcc561kgoi44ol43pa.apps.googleusercontent.com',
		clientSecret: 'zkJfVgIPYD5zQhaPI9a86s9N',
		callbackURL: 'http://www.aper.io' + portstring + '/logincallback/'
	},
	function(accessToken, refreshToken, profile, done) {

		// check whether this is a user who's logged in before:
		var email = profile.emails[0].value;
		api.query("users", {
			user_name: email
		}, function(data) {
			if (data.length > 0) {
				profile.db_id = data[0].id;
				return done(null, profile);
			} else {
				api.post("users", {"user_name": profile.emails[0].value, "real_name": profile.displayName, "picture_url": profile._json.picture}, function(result){
					profile.db_id = result.insertId;
				});
				return done(null, profile);
			}
		});
	}
));
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});