/**
 * Created by joaosilva on 26/05/15.
 */
app.controller('MenuCtrl', function ($scope, $ionicModal) {
    // Form data for the login modal
    $scope.loginData = {
        username:{

        },
        password:{

        }
    };

    // Form data for the sign up modal
    $scope.signUpData = {
        username:{

        },
        password:{

        },
        repeatPassword:{

        },
        nickname:{

        },
        country:{

        },
        rank:{

        }
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
        console.log('Doing login', $scope.loginData);
        $scope.closeLoginModal();
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
        console.log('Doing Sign Up', $scope.signUpData);
        $scope.closeSignUpModal();
        $scope.closeLoginModal();
    };
});