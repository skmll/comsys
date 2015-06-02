/**
 * Created by joaosilva on 28/05/15.
 */
app.service('OperatorInfo', function($ionicLoading, GeneralFunctions, OperatorStubService, EventsInfo) {
    var isLogged = 0;
    var nickname= "undefined";
    var country= "NLT";
    var rank= 1;
    var coordInpFormat= 0;
    var coordInpFormatText= "undefined";
    var mapGrid= 0;
    var specialisation= 0;

    //Return isLogged
    this.getIsLogged = function() {
        return isLogged;
    };

    //Set isLogged
    this.setIsLogged = function (newIsLogged) {
        isLogged = newIsLogged;
    };

    //Return nickname
    this.getNickname = function() {
        return nickname;
    };

    //Set nickname
    this.setNickname = function(newNick) {
        nickname = newNick;
    };

    //Return rank
    this.getRank = function() {
        return rank;
    };

    //Set rank
    this.setRank = function (newRank) {
        rank = newRank;
    };

    //Return country
    this.getCountry = function() {
        return country;
    };

    //Set country
    this.setCountry = function (newCountry) {
        country = newCountry;
    };

    //Return coordInpFormat
    this.getCoordInpFormat = function () {
        return coordInpFormat;
    };

    //Set coordInpFormat
    this.setCoordInpFormat = function (newCoordInpFormat) {
        coordInpFormat = newCoordInpFormat;
    };

    //Return coordInpFormatText
    this.getCoordInpFormatText = function () {
        return coordInpFormatText;
    };

    //Set coordInpFormat
    this.setCoordInpFormatText = function (newCoordInpFormatText) {
        coordInpFormatText = newCoordInpFormatText;
    };

    //Return mapGrid
    this.getMapGrid = function () {
        return mapGrid;
    };

    //Set mapGrid
    this.setMapGrid = function (newMapGrid) {
        mapGrid = newMapGrid;
    };

    //Return specialisation
    this.getSpecialisation = function() {
        return specialisation;
    };

    //Set specialisation
    this.setSpecialisation = function (newSpecialisation) {
        specialisation = newSpecialisation;
    };

    //Reset to default - Logout
    this.resetToDefault = function () {
        setIsLogged(0);
        setNickname("undefined");
        setCountry("NLT");
        setRank(1);
        setCoordInpFormat(0);
        setCoordInpFormatText("undefined");
        setMapGrid(0);
        setSpecialisation(0);
    };

    //Fetch and check if user is logged
    this.checkIfItsLogged = function () {
        OperatorStubService.loginCheckOperator()
            .success(function (data) {
                // closes loading spin
                $ionicLoading.hide();

                console.log(data);

                if (data.response==0){
                    // Bad result
                    GeneralFunctions.buildAlertPopUp('Unable to check',
                        'Unable to check if user is logged. Please check your internet connection.');
                }else{

                }
            })
            .error(function (error) {
                // closes loading spin
                $ionicLoading.hide();

                // Bad result
                GeneralFunctions.buildAlertPopUp('Something went wrong',
                    'Something went wrong: ' + error.message);
            });
    };

    // Fetch operator data
    this.getOperatorPersonalConfig = function (scope) {
        var self = this;
            OperatorStubService.getOperatorPersonalConfig()
            .success(function (data) {

                console.log(data);

                if (data.response == 0) {
                    // closes loading spin
                    $ionicLoading.hide();

                    // Bad password
                    GeneralFunctions.buildAlertPopUp('Unable to update',
                        'Unable to update user information.');
                } else {
                    //Change here the editProfileData and mapGrid variables
                    if (data.list.coord_format == 0){
                        self.setCoordInpFormatText("Lat/Long");
                    }else{
                        if (data.list.coord_format == 1){
                            self.setCoordInpFormatText("DMS");
                        }else{
                            if (data.list.coord_format == 2){
                                self.setCoordInpFormatText("UTM");
                            }else{
                                self.setCoordInpFormatText("MGRS");
                            }
                        }
                    }

                    self.setNickname(data.list.nickname);
                    self.setCountry(data.list.country.toUpperCase());
                    self.setRank(data.list.rank_ornumber);
                    self.setCoordInpFormat(data.list.coord_format);
                    self.setMapGrid(data.list.display_grid);
                    self.setSpecialisation(data.list.specialization_id);

                    // Closes the modal view
                    //scope.closeLoginModal();

                    EventsInfo.fetchAllEvents(scope);
                }
            })
            .error(function (error) {
                // closes loading spin
                $ionicLoading.hide();

                // Bad password
                GeneralFunctions.buildAlertPopUp('Unable to update',
                    'Unable to update user information: ' + error.message);
            });
    };

    // Function to login
    this.doLogin = function (username, password, scope) {
        var self = this;
        OperatorStubService.loginOperator(username, password)
            .success(function (data) {

                console.log(data);

                if(data.response==0){
                    // closes loading spin
                    $ionicLoading.hide();

                    // Bad result
                    GeneralFunctions.buildAlertPopUp('Unable to login',
                        'Unable to login. Please check all the fields and your internet connection.');
                }else {
                    // Change the variable isLogged to is logged state
                    self.setIsLogged(data.response);

                    scope.isLogged = data.response;

                    // Fetch operator data
                    self.getOperatorPersonalConfig(scope);
                }
            })
            .error(function (error) {
                // closes loading spin
                $ionicLoading.hide();

                // Bad result
                GeneralFunctions.buildAlertPopUp('Unable to login',
                    'Unable to login: ' + error.message);
            });
    };

    //Create operator
    this.doSignUp = function(password, rPassword, username, nickname, country, rank, specialisation, scope) {
        var self = this;
        console.log("RankID: "+rank);
        if (password == rPassword) {
            OperatorStubService.createOperator(username, password, nickname, country, rank, specialisation)
                .success(function (data) {

                    console.log(data);

                    if (data.response==0){
                        // closes loading spin
                        $ionicLoading.hide();

                        // Bad result
                        GeneralFunctions.buildAlertPopUp('Unable to sign up',
                            'Unable to sign up. Please check your internet connection.');
                    }else {
                        // Closes the modal view


                        // Do automatic login
                        self.doLogin(username, password, scope);
                    }
                })
                .error(function (error) {
                    // closes loading spin
                    $ionicLoading.hide();

                    console.log(error);

                    // Bad result
                    GeneralFunctions.buildAlertPopUp('Unable to sign up',
                        'Unable to sign up: ' + error.message);
                });
        }else{
            // closes loading spin
            $ionicLoading.hide();

            // Bad password
            GeneralFunctions.buildAlertPopUp('Wrong password',
                'The field \"Password\" and \"Repeat Password\" must be the same.');
        }
    };

    //Set new user data
    this.editProfileData = function (mapGrid, coordInpFormat, nickname, country, rank, specialisation){
        OperatorStubService.updateOperatorPersonalConfig(mapGrid, coordInpFormat, nickname, country, rank, specialisation)
            .success(function (data) {
                console.log(data);

                if(data.response==0){
                    // closes loading spin
                    $ionicLoading.hide();

                    // Bad password
                    GeneralFunctions.buildAlertPopUp('Unable to update',
                        'Unable to update profile information. Please check your internet connection.');

                    return false;
                }else{
                    if (coordInpFormat == 0){
                        setCoordInpFormatText("Lat/Long");
                    }else{
                        if (coordInpFormat == 1){
                            setCoordInpFormatText("DMS");
                        }else{
                            if (coordInpFormat == 2){
                                setCoordInpFormatText("UTM");
                            }else{
                                setCoordInpFormatText("MGRS");
                            }
                        }
                    }
                    setCoordInpFormat(coordInpFormat);
                    setNickname(nickname);
                    setCountry(country);
                    setRank(rank);
                    setMapGrid(mapGrid);
                    setSpecialisation(specialisation);

                    return true;
                }
            })
            .error(function (error) {
                // closes loading spin
                $ionicLoading.hide();

                // Bad password
                GeneralFunctions.buildAlertPopUp('Unable to update',
                    'Unable to update profile information: ' + error.message);

                return false;
            });
    };

    //Change user password
    this.changeUserPassword = function (password, rPassword, oPassword) {
        if (password == rPassword) {
            OperatorStubService.changeOperatorPassword(oPassword, password)
                .success(function (data) {
                    // closes loading spin
                    $ionicLoading.hide();

                    console.log(data);

                    if(data.response==0){
                        // Bad result
                        GeneralFunctions.buildAlertPopUp('Unable to change password',
                            'Unable to change password. Please check your internet connection.');
                    }else{
                    }
                })
                .error(function (error) {
                    // closes loading spin
                    $ionicLoading.hide();

                    // Bad result
                    GeneralFunctions.buildAlertPopUp('Unable to change password',
                        'Unable to change password: ' + error.message);
                });
        } else {
            // closes loading spin
            $ionicLoading.hide();

            // Bad password
            GeneralFunctions.buildAlertPopUp('Wrong password',
                'The field \"Password\" and \"Repeat Password\" must be the same.');

            return false;
        }
    };

    //Logout
    this.userLogout = function () {
        OperatorStubService.operatorLogout()
            .success(function (data) {

                console.log(data);

                if (data.response == 0){
                    // closes loading spin
                    $ionicLoading.hide();

                    // Bad password
                    GeneralFunctions.buildAlertPopUp('Unable to logout',
                        'Unable to logout. Please check your internet connection.');
                }else {
                    resetToDefault();
                }
            })
            .error(function (error) {
                // closes loading spin
                $ionicLoading.hide();

                // Bad password
                GeneralFunctions.buildAlertPopUp('Unable to logout',
                    'Unable to load data: ' + error.message);
            });
    };
});