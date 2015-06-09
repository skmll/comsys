app.service('ComsysInfo', function($ionicLoading, $ionicPopup, ComsysStubService) {
    var self = this;
    var userID = 0;

    // TODO: change this test data
    var eventID = 10;
    var factionID = 1;

    this.getEventID = function(){
        return eventID;
    };

    this.getFactionID = function(){
        return factionID;
    };

    // return userID
    this.getUserID = function() {

    };

    // create comsys
    this.createComsys = function() {
        
    };

    // create comsys
    this.setUserID = function(newUserID) {
        userID = newUserID;
    };

    // do login
    this.loginComsys = function (username, password, scope) {
        ComsysStubService.loginComsys(username, password)
        .success(function (data) {
            console.log(data);

                if(data.response==0){
                    // closes loading spin
                    $ionicLoading.hide();

                    // TODO: Server errors
                    self.buildAlertPopUp('Unable to login',
                        'TODO: Server errors');
                }else {
                    // Change the variable isLogged to is logged state
                    self.setUserID(data.response);

                    scope.isLogged = data.response;

                    $ionicLoading.hide();
                    scope.closeLoginModal();
                    // Fetch comsys data
                    //self.getComsysPersonalConfig(scope);
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

    this.buildAlertPopUp = function (title, template) {
        var alertBadRequestPopup = $ionicPopup.alert({
            title: title,
            template: template
        });
    };
});