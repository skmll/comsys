app.factory('ComsysInfo', function ($ionicLoading, $ionicPopup, ComsysStubService) {

    var factory = {};
    var serverError = 0;
    var undefined = "undefined";
    var userID = 0;
    var nickname = undefined;
    var coordInpFormat = 0;
    var coordInpFormatText = undefined;
    var mapGrid = 0;
    

    // TODO: change this test data
    var eventID = 10;
    var factionID = 1;

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
		//username, password, scope
		userID = response;
		factory.getIsLogged();	    
		/*
		ComsysStubService.loginComsys(username, password)
		.success(function (data) {
			// Check response
			console.log(data);

        if (data.response == 0) {
            // closes loading spin
            $ionicLoading.hide();

            // TODO: Server errors
            factory.buildAlertPopUp('Unable to login',
                'TODO: Server errors');
        } else {
            // Change the variable isLogged to is logged state
            factory.setUserID(data.response);
            scope.isLogged = data.response;

            // Fetch comsys data
            factory.getComsysPersonalConfig(scope);
        }
    })
		.error(function (error) {
			// closes loading spin
        $ionicLoading.hide();

        // Bad result
        factory.buildAlertPopUp('Unable to login',
            'Unable to login = ' + error.message);
		});
		*/
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
                factory.setMapGrid(data.list.display_grid);
                coordInpFormatText = factory.getCoordInpFormatTextFromID(parseInt(data.list.coord_format));
                if(coordInpFormatText == undefined) {
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
            // Couldn't connect to server
            // Stop loading animation
            $ionicLoading.hide();

            // Display alert
            factory.buildAlertPopUp('Profile Error', 'Unable to get profile information.');
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
    factory.getMapGrid = function (d) {
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
                return undefined;
        }
    };

    return factory;
		
});