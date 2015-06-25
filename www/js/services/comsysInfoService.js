app.factory('ComsysInfo', function ($ionicLoading, $ionicPopup, ComsysStubService, CommonStubService, MasterStubService) {

	var factory = {};
	var game_state = null;
	var serverError = 0;
	var userID = 0;
	var und = "undefined";
	var nickname = undefined;
	var coordInpFormat = 0;
	var coordInpFormatText = undefined;
	var mapGrid = false;
	var refreshMenuAfterLogout = true;
	var resetIsLoggedAfterLogoutCallback;
	
	var events = []; // Stores all existing events
	var allEvents = [];
	var eventSelected = null; // Stores the actual displayed event
	var comsysActualEvents = null; // Store all joined comsys events
	var comsysActualEventID = 0; // stores if selected event id = joined event id; 
	var afterLogginWEventsMapCallback = function(){};
	var eventID = 0;
	var factionID = 0;
	var factionPIN = 0;
	var pinEvent = 0;
	
	factory.getMenuRefresh = function(){
		return refreshMenuAfterLogout;
	};

	factory.setMenuRefresh = function (newValue) {
		refreshMenuAfterLogout = newValue;
	};

	factory.resetIsLogged = function (func) {
		resetIsLoggedAfterLogoutCallback = func;
	};

	factory.setAfterLogginWEventsMapCallback = function(func){
		afterLogginWEventsMapCallback = func;
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
				//EventsInfo.fetchAllEvents(scope);
			}
		})

		.error(function (error) {
			// Display alert
			factory.buildAlertPopUp('Server Error', 'Unable to get profile information.');
		});
	};

	// Get userID
	factory.getUserID = function () {
		return userID;
	};

	// Set userID
	factory.setUserID = function (newUserID) {
		userID = newUserID;
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

	factory.getEvents = function() {
		return events;
	};

	factory.setEvents = function(allEvents) {
		events = allEvents;
	};
	
	factory.getEventSelected = function () {
		return eventSelected;
	};

	factory.setEventSelected = function(newEventSelected) {
		eventSelected = newEventSelected;
		eventID = newEventSelected.id;
		console.log('eventID: ' + eventID);
		// Check if comsys is registed in the actual selected event
		factory.checkEventStatos(newEventSelected);
		};

	factory.getPinEvent = function () {
		return pinEvent;
	};

	factory.setPinEvent = function(newPinEvent) {
		pinEvent = newPinEvent; 
	};

	factory.leaveEvent = function() {
		pinEvent = 0;
		eventID = 0;
		comsysActualEventID = 0;
	};

	factory.getGameState = function() {
		return game_state;
	};
	
	factory.setGameState = function(newState) {
		game_state = newState;
	};

	factory.setComsysActualEvent = function(newComsysActualEvent) {
		comsysActualEvents = newComsysActualEvent;
		// passar aqui com o rafael
		//eventID = newComsysActualEvent.event_id;
		//factionID = newComsysActualEvent.faction_id;
		//afterLogginWEventsMapCallback(); 
	};
	
	factory.getComsysActualEvent = function() {
		return comsysActualEvents;
	};
	
	factory.getComsysActualEventID = function() {
		return comsysActualEventID;
	};

	factory.checkEventStatos = function(selectedEvent) {
		for(var i in events) {
		//console.log(events[i]);
			for(var j in comsysActualEvents) {
			if(events[i].id == comsysActualEvents[j].event_id) {					
				comsysActualEventID = 1;
				return;
			}
			}
		}
		comsysActualEventID = 0;
		return;
	};
	
	return factory;

});
