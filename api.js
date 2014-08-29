var getMySQLConn = module.parent.exports.getMySQLConn;

module.exports = {

	query: function(objectType, queryObj, callback) {
		var connection = getMySQLConn();
		objectType = connection.escapeId(objectType);

		var condition = "";
		var conjunction = " WHERE ";
		var joinObj = null;
		if (queryObj.join && queryObj.join.length > 0)
			joinObj = JSON.parse(queryObj.join);

		delete queryObj.join;
		for (var key in queryObj) {
			if (queryObj.hasOwnProperty(key)) {
				condition += conjunction + connection.escapeId(key) + "=" + connection.escape(queryObj[key]);
				conjunction = " AND ";
			}
		}
		var joinCondition = "";
		if (joinObj !== null) {
			joinCondition = " JOIN " + connection.escapeId(joinObj.with) +
				" ON " + connection.escapeId(joinObj.onl) +
				"=" + connection.escapeId(joinObj.onr);
		}

		console.log('SELECT * FROM ' + objectType + joinCondition + ' ' + condition + ' LIMIT 10');
		connection.query(
			'SELECT * FROM ' + objectType + joinCondition + ' ' + condition + ' LIMIT 10',
			function(err, rows) {
				if (err) {
					callback(null);
				}
				callback(rows);
			});
	},

	dosql: function(sql, params, callback) {
		var connection = getMySQLConn();
		connection.query(
			sql, params,
			function(err, rows) {
				if (err) {
					callback(null);
				}
				callback(rows);
			});
	},

	post: function(objectType, postObj, callback) {
		var connection = getMySQLConn();
		objectType = connection.escapeId(objectType);

		var keys = "";
		var values = "";
		var spacer = "";

		for (var key in postObj) {
			if (postObj.hasOwnProperty(key)) {
				keys += spacer + connection.escapeId(key);
				values += spacer + connection.escape(postObj[key]);
				spacer = ", ";
			}
		}

		var q = "INSERT INTO " + objectType + " (" + keys + ") VALUES (" + values + ")";
		console.log(q);
		connection.query(q, function(err, result) {
			if (err) {
				callback(null);
			} else {
				callback(result);
			}
		});
	},

	vote : function(response_id, voter_id, val, callback) {
		
		// user id from user object
		// user update to do: response.score += voter.rank/100

		var api = this;
		api.query("users", {"id": voter_id}, function(data){
			api.query("responses", {"id": response_id}, function(data2){
				var newScore = data2[0].rating + val*data[0].rank/100;
				var connection = getMySQLConn();
				var q = "UPDATE responses SET rating="+connection.escape(newScore)+" WHERE id="+connection.escape(response_id);
				console.log(q);
				connection.query(q, function(err, result){
					if (err) {
						callback(null);
					} else {
						callback(result);
					}
				});
			});
		});
	}

}