/**
 * Created by joaosilva on 26/05/15.
 */
app.controller('MenuCtrl', function ($scope, $ionicModal, OperatorInfo) {
    // Set userLogged - 0:Not logged 1:Logged
    $scope.isLogged = OperatorInfo.getIsLogged();

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
        nickname:"",
        country:"NLT",
        rank:1,
        specialisation:1
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
    $scope.doLogin = function () {
        var loadingLogin = $ionicLoading.show({
            content: 'Saving login information',
            showBackdrop: false
        });
        OperatorInfo.doLogin($scope.loginData.username, $scope.loginData.password, $scope);
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
    $scope.doSignUp = function () {
        var loadingSignUP = $ionicLoading.show({
            content: 'Saving sign up information',
            showBackdrop: false
        });
        console.log('Doing Sign Up', $scope.signUpData);

        OperatorInfo.doSignUp($scope.signUpData.password, $scope.signUpData.repeatPassword,
            $scope.signUpData.username, $scope.signUpData.nickname, $scope.signUpData.country,
            $scope.signUpData.rank, $scope.signUpData.specialisation, scope);
    };
});