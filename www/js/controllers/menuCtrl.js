app.controller('MenuCtrl', function ($scope, $ionicModal, $ionicLoading, ComsysInfo) {
    
	// Set userLogged - 0:Not logged 1:Logged
    $scope.isLogged = ComsysInfo.getIsLogged();

    // Form data for the login modal
    $scope.loginData = {
        username:"",
        password:""
    };

    // Form data for the sign up modal
    $scope.signUpData = {
        username:"",
        password:"",
        repeatPassword:"",
        nickname:""
    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modalLogin) {
        $scope.modalLogin = modalLogin;
    });

    // Triggered in the login modal to close it
    $scope.closeLoginModal = function () {
        $scope.modalLogin.hide();
    };

    // Open the login modal
    $scope.openLoginModal = function () {
        $scope.modalLogin.show();
    };

    // Perform the login action when the user submits the login form
    $scope.loginComsys = function () {
        var loadingLogin = $ionicLoading.show({
            content: 'Saving login information',
            showBackdrop: false
        });
        // TODO: add parameters etc
        ComsysInfo.loginComsys($scope.loginData.username, $scope.loginData.password, $scope);
    };

    // Create the sign up modal that we will use later
    $ionicModal.fromTemplateUrl('templates/signUp.html', {
        scope: $scope
    }).then(function (modalSignUp) {
        $scope.modalSignUp = modalSignUp;
    });

    // Open the sign up modal
    $scope.openSignUpModal = function () {
        $scope.modalSignUp.show();
    };

    // Triggered in the sign up modal to close it
    $scope.closeSignUpModal = function () {
        $scope.modalSignUp.hide();
    };

    // Perform the sign up action when the user submits the login form
    $scope.createComsys = function () {
        var loadingSignUP = $ionicLoading.show({
            content: 'Saving sign up information',
            showBackdrop: false
        });
        console.log('Doing Sign Up', $scope.signUpData);

        ComsysInfo.createComsys();
    };
});