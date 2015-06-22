app.factory('ComsysInfo', function ($ionicLoading, $ionicPopup, ComsysStubService) {

    var factory = {};
    var serverError = 0;
    var userID = 0;
    var und = "undefined";
    var nickname = undefined;
    var coordInpFormat = 0;
    var coordInpFormatText = undefined;
<<<<<<< HEAD
    var mapGrid = false;
    var refreshMenuAfterLogout = true;
	var resetIsLoggedAfterLogoutCallback;
	
	factory.getMenuRefresh = function(){
        return refreshMenuAfterLogout;
    };
	
	factory.setMenuRefresh = function (newValue) {
		refreshMenuAfterLogout = newValue;
	};
	
	factory.resetIsLogged = function (func) {
		resetIsLoggedAfterLogoutCallback = func;
	};
	
=======
    var mapGrid = 0;
var allEvents = [];
var eventSelected = null;    
    
>>>>>>> 3b437e5abda6a82fc5c57170961f958a70e78ed5
    // TODO: change this test data
    var eventID = 1;
    var factionID = 1;

    var afterLogginMapCallback;

    factory.setAfterLogginMapCallback = function(func){
        afterLogginMapCallback = func;
    };

    factory.getEventID = function(){
        return eventID;
    };

	factory.getFactionID = function(){
		return factionID;
	};

	factory.getIsLogged = function() {
		return userID;
	};

	factory.loginComsys = function (response) {
		userID = response;

        afterLogginMapCallback();
	};

	// Login was successful -> Get COMSYS personal configuration
	factory.getComsysPersonalConfig = function (scope) {
		ComsysStubService.getComsysPersonalConfig()
		.success(function (data) {
			console.log(data); // DEBUG
<<<<<<< HEAD

			if  (data.response == serverError ) {
				// Server couldn't get COMSYS personal configuration -> Display alert
=======
			if (data.response == serverError) {
				// Server couldn't get COMSYS personal configuration -> Display alert
				// Stop loading animation 
				$ionicLoading.hide();
				// Display alert
>>>>>>> 3b437e5abda6a82fc5c57170961f958a70e78ed5
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
<<<<<<< HEAD
=======

				// Stop loading animation and close modal view
				$ionicLoading.hide();
				scope.closeLoginModal();
				//EventsInfo.fetchAllEvents(scope);
>>>>>>> 3b437e5abda6a82fc5c57170961f958a70e78ed5
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

	
	factory.fetchAllEvents = function () {
        
        CommonStubService.getAllEvents()
            .success(function (data) {

                console.log(data);

                if (data.response == 0) {
                    var aux = "";
                    for (var key in data.errors) {
                        if (data.errors.hasOwnProperty(key)) {
                            aux = aux + data.errors[key];
                        }
                    }
                    // Bad result
                    ComsysInfo.buildAlertPopUp('Unable to get all events',
                        'Unable to get all events: ' + aux);
                }else{
                    for(var i = 0; i < data.list.length; i++){
                        events.push(data.list[i]);
                    }
                }
            })
            .error(function (error) {
                // closes loading spin
                //$ionicLoading.hide();

                // Bad result
                ComsysInfo.buildAlertPopUp('Unable to get all events',
                    'Unable to get all events: ' + error);
            })
    };
	factory.getAllEvents = function() {
		return events;
	};
	
	    factory.getEventSelected = function () {
        return eventSelected;
    };

	return factory;

});