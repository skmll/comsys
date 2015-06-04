app.service('ComsysInfo', function ($ionicLoading, $ionicPopup, ComsysStubService) {

    var self = this;
    var serverError = 0;
    var undefined = "undefined";
    var userID = 0;
    var nickname = undefined;
    var coordInpFormat = 0;
    var coordInpFormatText = undefined;
    var mapGrid = 0;
    
    // create comsys
    this.createComsys = function () {

    };



    // Login COMSYS
    this.loginComsys = function (username, password, scope) {
        ComsysStubService.loginComsys(username, password)
            .success(function (data) {
            console.log(data);

            if (data.response == 0) {
                // closes loading spin
                $ionicLoading.hide();

                // TODO: Server errors
                self.buildAlertPopUp('Unable to login',
                    'TODO: Server errors');
            } else {
                // Change the variable isLogged to is logged state
                self.setUserID(data.response);
                scope.isLogged = data.response;

                // Fetch comsys data
                self.getComsysPersonalConfig(scope);
            }
        })
            .error(function (error) {
            // closes loading spin
            $ionicLoading.hide();

            // Bad result
            self.buildAlertPopUp('Unable to login',
                'Unable to login: ' + error.message);
        });
    };

    // Login was successful -> Get COMSYS personal configuration
    this.getComsysPersonalConfig = function (scope) {

        ComsysStubService.getComsysPersonalConfig()
            .success(function (data) {

            console.log(data); // DEBUG

            if (data.response == serverError) {
                // Server couldn't get COMSYS personal configuration -> Display alert
                // Stop loading animation 
                $ionicLoading.hide();
    
                // Display alert
                self.buildAlertPopUp('Profile Error', 'Unable to get profile information.');

            } else {
                // Operation successful -> Fill profile variables
                self.setNickname(data.list.nickname);
                self.setCoordInpFormat(data.list.coord_format);
                self.setMapGrid(data.list.display_grid);
                coordInpFormatText = self.getCoordInpFormatTextFromID(parseInt(data.list.coord_format));
                if(coordInpFormatText == undefined) {
                    self.buildAlertPopUp('GPS Coordinates Error', 'Unknown GPS coordinate format, defaulting to LAT/LONG.');
                    self.setCoordInpFormatText("Lat/Long");
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
            self.buildAlertPopUp('Profile Error', 'Unable to get profile information.');
        });
    };
    
    // Get userID
    this.getUserID = function () {
        return userID;
    };
    
    // Set userID
    this.setUserID = function (newUserID) {
        userID = newUserID;
    };
    
    // Get nickname
    this.getNickname = function () {
        return nickname;
    };
    
    // Set nickname
    this.setNickname = function (newNickname) {
        nickname = newNickname;
    };
    
    // Get coordInpFormat
    this.getCoordInpFormat = function () {
        return coordInpFormat;
    };
    
    // Set coordInpFormat
    this.setCoordInpFormat = function (newCoordInpFormat) {
        coordInpFormat = newCoordInpFormat;
    };
    
    // Get coordInpFormatText
    this.getCoordInpFormatText = function () {
        return coordInpFormatText;
    };
    
    // Set coordInpFormatText
    this.setCoordInpFormatText = function (newCoordInpFormatText) {
        coordInpFormatText = newCoordInpFormatText;
    };
    
    // Get mapGrid
    this.getMapGrid = function (d) {
        return mapGrid;
    };
    
    // Set mapGrid
    this.setMapGrid = function (newMapGrid) {
        mapGrid = newMapGrid;
    };

    // Build alert
    this.buildAlertPopUp = function (title, template) {
        var alertBadRequestPopup = $ionicPopup.alert({
            title: title,
            template: template
        });
    };

    // Get coordinate input format text based on ID
    this.getCoordInpFormatTextFromID = function (coordFormat) {
        
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
});