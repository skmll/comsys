app.factory('ComsysInfo', function ($ionicLoading, $ionicPopup, ComsysStubService, CommonStubService) {

	/*########## AUX VARIABLES #############*/
	var factory = {};
	var und = "undefined";
	var serverError = 0;
	var afterGoLiveMapCallback = function(){};
	var refreshMenuAfterLogout = true;
	var resetIsLoggedAfterLogoutCallback;
	/*######################################*/


	/*########## USER VARIABLES #############*/
	var userID = 0;
	var nickname = undefined;
	var coordInpFormat = 0;
	var coordInpFormatText = undefined;
	var mapGrid = false;
	/*#######################################*/


	/*########## LIVE EVENT #############*/
	var liveEvent = null;
	var eventID = 0; //Live Event ID
	var factionID = 0; //Live Event Faction ID
	var factionPIN = 0; // Live Event Faction PIN
	var game_state = null; //Live Event Game State
	/*###################################*/


	/*########## NOT LIVE EVENTS #############*/
	//var events = []; // Stores all existing events
	var eventSelected = null; // Stores the actual event details displayed
	var eventsIdsComsysRegistered = null; // Store all events in which comsys is registered
	/*########################################*/
	
	/*############### INFO ################
	*	event status: [SERVER = FIREBASE]:
	*		0 = register; (nunca vai ter ao firebase)
	*		1 = prestarted;
	*		2 = started;
	*		3 = paused;
	*		4 = ended;
	*###################################### */
	
	factory.getMenuRefresh = function(){
		return refreshMenuAfterLogout;
	};

	factory.setMenuRefresh = function (newValue) {
		refreshMenuAfterLogout = newValue;
	};

	factory.resetIsLogged = function (func) {
		resetIsLoggedAfterLogoutCallback = func;
	};

	factory.setAfterGoLiveMapCallback = function(func){
		afterGoLiveMapCallback = func;
	};

	factory.getEventID = function(){
		return eventID;
	};

	factory.getFactionID = function(){
		return factionID;
	};

	factory.getFactionPIN = function(){
		return factionPIN;
	};

	factory.getIsLogged = function() {
		return userID;
	};

	factory.loginComsys = function (response) {
		userID = response;
	};

	// Login was successful -> Get COMSYS personal configuration
	factory.getComsysPersonalConfig = function (scope) {
		ComsysStubService.getComsysPersonalConfig()
		.success(function (data) {
			console.log(data); // DEBUG
			if (data.response == serverError) {
				// Server couldn't get COMSYS personal configuration -> Display alert
				// Stop loading animation 
				$ionicLoading.hide();
				// Display alert
				factory.buildAlertPopUp('Profile Error', 'Unable to get profile information.');
			} else {
				// Operation successful -> Fill profile variables
				factory.setNickname(data.list.nickname);
				factory.setCoordInpFormat(data.list.coord_format);
				if(data.list.display_grid == 0) {
					mapGrid = false;
				}
				else {
					mapGrid = true;
				}
				factory.setMapGrid(mapGrid);
				coordInpFormatText = factory.getCoordInpFormatTextFromID(parseInt(data.list.coord_format));

				if(coordInpFormatText == und) {
					factory.buildAlertPopUp('GPS Coordinates Error', 'Unknown GPS coordinate format, defaulting to LAT/LONG.');
					factory.setCoordInpFormatText("Lat/Long");
				}
				// Stop loading animation and close modal view
				$ionicLoading.hide();
				scope.closeLoginModal();
			}
		})

		.error(function (error) {
			// Display alert
			factory.buildAlertPopUp('Server Error', 'Unable to get profile information.');
		});
	};

	// Get nickname
	factory.getNickname = function () {
		return nickname;
	};

	// Set nickname
	factory.setNickname = function (newNickname) {
		nickname = newNickname;
	};

	// Get coordInpFormat
	factory.getCoordInpFormat = function () {
		return coordInpFormat;
	};

	// Set coordInpFormat
	factory.setCoordInpFormat = function (newCoordInpFormat) {
		coordInpFormat = newCoordInpFormat;
	};

	// Get coordInpFormatText
	factory.getCoordInpFormatText = function () {
		return coordInpFormatText;
	};

	// Set coordInpFormatText
	factory.setCoordInpFormatText = function (newCoordInpFormatText) {
		coordInpFormatText = newCoordInpFormatText;
	};

	// Get mapGrid
	factory.getMapGrid = function () {
		return mapGrid;
	};

	// Set mapGrid
	factory.setMapGrid = function (newMapGrid) {
		mapGrid = newMapGrid;
	};

	// Build alert
	factory.buildAlertPopUp = function (title, template) {
		var alertBadRequestPopup = $ionicPopup.alert({
			title: title,
			template: template
		});
	};

	// Get coordinate input format text based on ID
	factory.getCoordInpFormatTextFromID = function (coordFormat) {

		switch (coordFormat) {
		case 0:
			return "Lat/Long";
			break;
		case 1:
			return "DMS";
			break;
		case 2:
			return "UTM";
			break;
		case 3:
			return "MGRS";
			break;
		default:
			return und;
		}
	};

	factory.userLogout = function() {

		refreshMenuAfterLogout = true;
		userID = 0;
		resetIsLoggedAfterLogoutCallback();

	};

	factory.changeUserPassword = function(oldPassword, newPassword, newPasswordRepeat, closeModalOnSuccess) {

		// Check if fields are empty
		if ( !oldPassword || !newPassword || !newPasswordRepeat ) {

			// Stop animation and display alert
			$ionicLoading.hide();
			factory.buildAlertPopUp('Change Password Error', 'Error: All fields are required!');
			return;
		}

		// Check if new password and new password repeat are equal

		else if ( !factory.verifyRepeatPassword(newPassword, newPasswordRepeat) ) {

			// Stop animation and display alert
			$ionicLoading.hide();
			factory.buildAlertPopUp('Change Password Error', 'Error: "New Password" and "Repeat New Password" don\'t match!');
			return;
		}

		// Check if newPassword isn't the same as it was before
		else if ( (oldPassword == newPassword) ) {

			// Stop animation and display alert
			$ionicLoading.hide();
			factory.buildAlertPopUp('Change Password Error', '"New Password" must be different from the current one!');
			return;
		}

		// Call stub service to change password
		else {

			ComsysStubService.changeComsysPassword(oldPassword, newPassword)

			.success(function (data) {

				console.log(data); // DEBUG

				if (data.response == serverError) {
					// Server couldn't get COMSYS personal configuration -> Display alert
					// Stop loading animation 
					$ionicLoading.hide();

					var errorMessage = factory.getAllErrors(data.errors);

					// Display alert with errors
					factory.buildAlertPopUp('Change Password Error', errorMessage);

				} else {
					// Operation successful
					// Stop loading animation and close modal view
					$ionicLoading.hide();
					factory.buildAlertPopUp('Change Password', 'Password changed successfully!');
					closeModalOnSuccess();
				}

			})

			.error(function (error) {
				// Couldn't connect to server
				// Stop loading animation
				$ionicLoading.hide();

				// Display alert
				factory.buildAlertPopUp('Server error', 'Unable to change password. Either the server or your internet connection is down.');
			});

		}

	};

	factory.getAllErrors = function(errorList) {

		var errorMessage = "";

		if (errorList.username) {
			errorMessage = errorMessage.concat("<strong>Username error:</strong> ", errorList.username[0], "<br>");
		}

		if (errorList.password) {
			errorMessage = errorMessage.concat("<strong>Password error:</strong> ", errorList.password[0], "<br>");
		}

		if (errorList.nickname) {
			errorMessage = errorMessage.concat("<strong>Nickname error:</strong> ", errorList.nickname[0], "<br>");
		}

		if (errorList.old) {
			errorMessage = errorMessage.concat("<strong>Old password error:</strong> ", errorList.old, "<br>");
		}

		if (errorList.new) {
			errorMessage = errorMessage.concat("<strong>New password error:</strong> ", errorList.new, "<br>");
		}

		// Remove last <br> and return error message
		return errorMessage = errorMessage.substring(0, errorMessage.length - 4);

	};

	factory.verifyRepeatPassword = function(password, repeatPassword) {

		if ( !password || !repeatPassword ) return false;
		else if ( !(password == repeatPassword) ) return false;
		else return true;

	};

	factory.isSelectedEventLive = function(){
		return eventSelected.id == eventID;
	}; 

	factory.hasSelectedEventStarted = function() {
		//console.log('Started?', eventSelected);
		return eventSelected.status == 2;
	};
	
	factory.goLive = function() {
		liveEvent = eventSelected;
		eventID = 1;//liveEvent.id; //TODO: id right?
		factionID = 1;//liveEvent.factionID; //TODO
		factionPIN = 1111;//liveEvent.factionPIN; //TODO
		afterGoLiveMapCallback(); 
	};

	factory.leaveLive = function(){
		liveEvent = null;
		eventID = 0;
		factionID = 0;
		factionPIN = 0;
		//TODO: afterLeaveLifeMapCallback? //TODO
	};

	
	factory.getEventSelected = function () {
		return eventSelected;
	};

	factory.getEventIdsOfRegisteredEvent = function (eventId) {
		for (var index = 0; index < eventsIdsComsysRegistered.length; index++) {
			var event = eventsIdsComsysRegistered[index];
			if(eventId == event.event_id){
				return event;
			}
		}
		return null;
	};

	factory.setEventSelected = function(newEventSelected) {
		eventSelected = newEventSelected;
	};

	factory.joinEvent = function() {
		eventSelected.registered = true;
		var eventRegistered = factory.getEventIdsOfRegisteredEvent(eventSelected.id);

		eventSelected.factionPIN = eventRegistered.faction_pin;
		eventSelected.factionID = eventRegistered.faction_id;

		return eventSelected;
	};

	factory.leaveEvent = function() {
		if(factory.isSelectedEventLive){
			factory.leaveLive(); //TODO: this right?
		}
		eventSelected.registered = false;
		delete eventSelected.factionPIN;
		delete eventSelected.factionID;
		//console.log('afterLeaving', eventSelected);

		for (var index = 0; index < eventsIdsComsysRegistered.length; index++) {
			var event = eventsIdsComsysRegistered[index];
			//console.log("########################", eventSelected);
			if(event.event_id == eventSelected.id){
				eventsIdsComsysRegistered.splice(index, 1);
			}
		}

		return eventSelected;
	};

	
	factory.getGameState = function() {
		return game_state;
	};
	
	factory.setGameState = function(newState) {
		game_state = newState;
	};
	
	factory.setEventsIdsComsysRegistered = function(newEventsIdsComsysRegistered) {
		eventsIdsComsysRegistered = newEventsIdsComsysRegistered;
	};
	
	factory.getEventsIdsComsysRegistered = function() {
		return eventsIdsComsysRegistered;
	};
	

	factory.isComsysRegisteredInEvent = function(eventId) {
		for(var j in eventsIdsComsysRegistered) {
			if(eventId == eventsIdsComsysRegistered[j].event_id) {
				return true;
			}
		}
		return false;
	};
	
	return factory;

	 /*
	// Get userID
	factory.getUserID = function () {
		return userID;
	};

	// Set userID
	factory.setUserID = function (newUserID) {
		userID = newUserID;
	};
*/

/*
	factory.isComsysRegisteredInSelectedEvent = function() {
		for(var j in eventsIdsComsysRegistered) {
			if(eventSelected.id == eventsIdsComsysRegistered[j].event_id) {
				return true;
			}
		}
		return false;
	};
*/

/*	
	factory.getSelectedEventIds = function () {
		for (var index = 0; index < eventsIdsComsysRegistered.length; index++) {
			var event = eventsIdsComsysRegistered[index];
			if(eventSelected.id == event.event_id){
				return event;
			}
		}
		return null;
	};
*/

/*
	factory.getEvents = function() {
		return events;
	};
	
	factory.setEvents = function(allEvents) {
		events = allEvents;
	};
*/
});
