app.factory('ComsysStubService', function ($http) {

	var baseUrl = 'http://192.168.234.37/SOCOM_BO/public/v1/';
	var firebaseUrl = 'https://socom-bo-estg-2015.firebaseio.com/events_in_progress/';

	var requestPost =
	{
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
	};

	var squadIdsAlreadyRef = [];
	var squadIdsKnown = [];

	$http.defaults.withCredentials = true;
	
	function escapeIfNotNull(variable) {

		return variable;
		/*if (variable != null) return escape(variable);
		return null;*/
	}

	function arrayContainsVar(array, variable){
		for (var i = 0; i < array.length; i++) {
			if(array[i] == variable){
				return true;
			}
		};
		return false;
	}

	return {
		
		/***** Laravel Services *****/

		/* Service #16 */
		createComsys: function (username, password, nickname) {
			requestPost.url = baseUrl + 'comsys/create';
			requestPost.params = { username: escapeIfNotNull(username), password: escapeIfNotNull(password), nickname: escapeIfNotNull(nickname) };
			return $http(requestPost);
		},
		
		/* Service #17 */
		loginComsys: function (username, password) {
			requestPost.url = baseUrl + 'comsys/login';
			requestPost.params = { username: escapeIfNotNull(username), password: escapeIfNotNull(password) };
			return $http(requestPost);
		},
		
		/* Service #18 */
		loginCheckComsys: function () {
			return $http.get(baseUrl + 'comsys/login/check');
		},
		
		/* Service #19 */
		logoutComsys: function () {
			return $http.get(baseUrl + 'comsys/logout');
		},

		/* Service #20 */
		changeComsysPassword: function (oldPassword, newPassword) {
			requestPost.url = baseUrl + 'comsys/password/update';
			requestPost.params = { old: escapeIfNotNull(oldPassword), new: escapeIfNotNull(newPassword) };
			return $http(requestPost);
		},
		
		/* Service #21 */
		getComsysPersonalConfig: function () {
			return $http.get(baseUrl + 'comsys/config/personal/get');
		},
		
		/* Service #22 */
		updateComsysPersonalConfig: function (nickname, displayGrid, coordFormat) {
			requestPost.url = baseUrl + 'comsys/config/personal/update';
			requestPost.params = { nickname: escapeIfNotNull(nickname), display_grid: escapeIfNotNull(displayGrid), coord_format: escapeIfNotNull(coordFormat) };
			return $http(requestPost);
		},

		/* Service #133 */
		getEventsOfComsys: function () {
			return $http.get(baseUrl + 'comsys/event/get/all');
		},

		/***** Firebase Services *****/

		/* Service F08 */
		sendNotificationToComsys: function (eventId, factionId, comsysId, available_responses_list, sender, text) {
			var ref = new Firebase(firebaseUrl + eventId + '/factions/' + factionId + '/comsys_users/' + comsysId + '/comsys_notifications/');
			ref.push({
				available_responses_list: available_responses_list,
				sender: sender,
				text: text,
				timestamp: Firebase.ServerValue.TIMESTAMP
			});
		},
		
		/* Service F09 */
		sendNotificationToFaction: function (eventId, factionId, available_responses_list, sender, text) {
			var ref = new Firebase(firebaseUrl + eventId + '/factions/' + factionId + '/faction_notifications/');
			ref.push({
				available_responses_list: available_responses_list,
				sender: sender,
				text: text,
				timestamp: Firebase.ServerValue.TIMESTAMP
			});
		},
		
		/* Service F10 */
		sendNotificationToSquad: function (eventId, factionId, squadId, available_responses_list, sender, text) {
			var ref = new Firebase('https://socom-bo-estg-2015.firebaseio.com/events_in_progress/' + eventId + '/factions/' + factionId + '/squads/' + squadId + '/squad_notifications/');
			ref.push({
				available_responses_list: available_responses_list,
				sender: sender,
				text: text,
				timestamp: Firebase.ServerValue.TIMESTAMP
			});
		},
		
		/* Service F11 */
		sendNotificationToOperator: function (eventId, factionId, operatorId, available_responses_list, sender, text) {
			var ref = new Firebase('https://socom-bo-estg-2015.firebaseio.com/events_in_progress/' + eventId + '/factions/' + factionId + '/operators/' + operatorId + '/operator_notifications/');
			ref.push({
				available_responses_list: available_responses_list,
				sender: sender,
				text: text,
				timestamp: Firebase.ServerValue.TIMESTAMP
			});
		},

		/* Service F12 */
		sendTimestamp: function (eventId, factionId, comsysId) {
			var ref = new Firebase(firebaseUrl + eventId + '/factions/' + factionId + '/comsys_users/' + comsysId);
			ref.update({
				timestamp: Firebase.ServerValue.TIMESTAMP
			});
		},
		
		/* Service F13 */
		addEnemyPing: function (eventId, factionId, gps_lat, gps_lng, enemiesNumber, direction) {
			var special_actRef = new Firebase(firebaseUrl + eventId + "/factions/" + factionId + "/special_actions");
			special_actRef.push({
				action: "enemy",
				enemies_number: enemiesNumber,
				direction: direction,
				gps_lat: gps_lat,
				gps_lng: gps_lng,
				timestamp: Firebase.ServerValue.TIMESTAMP
			});
		},
		
		/* Service F19 */
		getComsysAllowedNotifReceiver: function (eventId, factionId, comsysId, callback) {
			var ref = new Firebase(firebaseUrl + eventId + '/factions/' + factionId + '/operators/');
			var squadRef = new Firebase(firebaseUrl + eventId + '/factions/' + factionId + '/squads/');
			var comsysRef = new Firebase(firebaseUrl + eventId + '/factions/' + factionId + '/comsys_users/');
			var factionRef = new Firebase(firebaseUrl + eventId + '/factions/' + factionId);
			var operators;
			var squads;
			var faction;
			var allowedNotifReceivers = [];
			var comsys;

			ref.once("value", function(snapshot) {
				operators = snapshot.val();
				
				for (var id in operators) {
					allowedNotifReceivers.push({id: id, name: operators[id].nickname, type: 'operator'});
				};

				squadRef.once("value", function(snapshot) {
					squads = snapshot.val();

					for (var id in squads) {
						allowedNotifReceivers.push({id: id, name: 'Squad ' + squads[id].tag, type: 'squad'});
					};

					comsysRef.once("value", function(snapshot) {
						comsys = snapshot.val();
						
						for (var id in comsys) {
							if(id != comsysId){
								allowedNotifReceivers.push({id: id, name: comsys[id].nickname, type: 'comsys'});
							}
						};

						factionRef.once("value", function(snapshot) {

							faction = snapshot.val();
							allowedNotifReceivers.push({id: factionId, name: faction.name, type: 'faction'});
							callback(allowedNotifReceivers);
							

						}, function (errorObject) {
							console.log("The read failed: " + errorObject.code);
						});

					}, function (errorObject) {
						console.log("The read failed: " + errorObject.code);
					});

				}, function (errorObject) {
					console.log("The read failed: " + errorObject.code);
				});

			}, function (errorObject) {
				console.log("The read failed: " + errorObject.code);
			});
		},
		
		searchFirebase: function(eventId, callback) {
			var ref = new Firebase(firebaseUrl + eventId + "/factions/");
			ref.on("value", function(snapshot) {
				var factionsId = snapshot.val();
				callback(factionsId);
			});
		},

		/* Firebase methods */
		searchScore: function(eventId, factionId, callback) {
			var ref = new Firebase(firebaseUrl + eventId + "/factions/" + factionId + "/score/");
			ref.on("value", function(snapshot) {
				var score = snapshot.val();
				callback(score);
			});
		},

		changeMasterScore: function (eventId, factionId, score) {
			var ref = new Firebase('https://socom-bo-estg-2015.firebaseio.com/events_in_progress/' + eventId + '/factions/' + factionId + '/');
			ref.update({
				score: score
			});
		},

		viewMyFaction: function(eventId, factionId, callback) {
	var ops = [];
				var ref = new Firebase(firebaseUrl + eventId + '/factions/' + factionId + '/operators');
				ref.on("value", function(snapshot) {
		var operators = snapshot.val();
		for(idOperator in operators) {
			ops.push(idOperator);
		}
		callback(ops);
				});
},

		checkGameState: function(eventId, callback) {
			var ref = new Firebase(firebaseUrl + eventId + '/game_state');
			ref.on("value", function(snapshot) {
				var state = snapshot.val();
				if(state == "started") {
					callback(state);
				}
				else {
					callback("Event not started yet");
				}
			});
		},
		
		onFactionEnemyPingAdded: function(eventId, factionId, callback) {
			var squads = [];
			
			var squadsRef = new Firebase(firebaseUrl + eventId + '/factions/' + factionId + '/squads');
			squadsRef.on('value', function(snapshot) {
				squads = snapshot.val();
				for(var squadId in squads){
					if(arrayContainsVar(squadIdsAlreadyRef, squadId)){
						console.log('squad id ' + squadId + ' already referenced');
						continue;
					}
					squadIdsAlreadyRef.push(squadId);
					var squadRef = new Firebase(firebaseUrl + eventId + '/factions/' + factionId + '/squads/' 
						+ squadId + '/pings');
					squadRef.on('child_added', function(childSnapshot, prevChildKey) {
						if(childSnapshot.val().action == 'enemy'){
							callback(childSnapshot.val()); 
						}
					});
				};
			});
			
			var ref2 = new Firebase(firebaseUrl + eventId + '/factions/' + factionId + '/special_actions');
			ref2.on('child_added', function(childSnapshot, prevChildKey) {
				if(childSnapshot.val().action == 'enemy'){
					callback(childSnapshot.val()); 
				} 
			});
		},
	
		onSquadsIdsChanged: function(eventId, factionId, callback) {
			var squads = [];
			
			var squadsRef = new Firebase(firebaseUrl + eventId + '/factions/' + factionId + '/squads');
			squadsRef.on('value', function(snapshot) {
				squads = snapshot.val();
				var squadIdsFromFirebase = [];
				
				for(var squadId in squads){
					squadIdsFromFirebase.push(squadId);
					if(!arrayContainsVar(squadIdsKnown, squadId)){
						console.log('adding to array ', squadId);
						squadIdsKnown.push(squadId);
						callback(squadId, 'added');
					}
				};
				//console.log('squadIdsKnown', squadIdsKnown);

				for (var index = 0; index < squadIdsKnown.length; index++) {
					if(!arrayContainsVar(squadIdsFromFirebase, squadIdsKnown[index])){
						console.log('removing from array', squadIdsKnown[index]);
						var squadId = squadIdsKnown.splice(index, 1);
						console.log('array after removing ' + squadIdsKnown[index], squadIdsKnown);
						callback(squadId[0], 'removed');
					}
				};
			});
		}	
		
		
	};
	
});