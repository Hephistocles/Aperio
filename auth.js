/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global require, module */


var passport = require("passport");
var app = module.parent.exports.app;
var api = module.parent.exports.api;

app.use(passport.initialize());
app.use(passport.session());
var passport = require("passport");
var google_strategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new google_strategy({
		clientID: '308460185536-40t5uojh8phm77gcc561kgoi44ol43pa.apps.googleusercontent.com',
		clientSecret: 'zkJfVgIPYD5zQhaPI9a86s9N',
		callbackURL: 'http://www.aper.io/logincallback/'
	},
	function(accessToken, refreshToken, profile, done) {

		// check whether this is a user who's logged in before:
		var email = profile.emails[0].value;
		api.query("users", {
			user_name: email
		}, function(data) {
			if (data.length > 0) {
				// this is a user we've seen before
				// will want to attach more data to "profile"
				return done(null, profile);
			} else {
				// this is a new user, so need to insert!
				// will want to attach more data to "profile"
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