app.controller('MenuCtrl', function ($scope, $ionicModal, $ionicLoading, ComsysInfo, $location, ComsysStubService) {

	var firebaseUrl = "https://socom-bo-estg-2015.firebaseio.com/";

	// User Statos (0 - not logged, 1 - logged)
	$scope.isLogged = ComsysInfo.getIsLogged();

	$scope.refreshMenu = function() {
		// User Statos (0 - not logged, 1 - logged)
		$scope.isLogged = ComsysInfo.getIsLogged();
	}

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
		ComsysStubService.loginComsys($scope.loginData.username, $scope.loginData.password)
		.success(function (data) {
			console.log(data);
			ComsysInfo.loginComsys(data.response);
		})
		.error(function (error) {
			//console.log(error);
			ComsysInfo.buildAlertPopUp('Unable to login',
            'Unable to login = ' /*+ error.message*/);
		});
		$ionicLoading.hide();
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
	$scope.createComsys = function () {
		var loadingSignUP = $ionicLoading.show({
			content: 'Saving sign up information',
			showBackdrop: false
		});
		ComsysInfo.createComsys();
	};

	$scope.sendSystemHack = function() {
		var factionsId = [];
		var ref = new Firebase(firebaseUrl + "events_in_progress/" 
			+ ComsysInfo.getEventID() + "/factions/");

		ref.once("value", function(snapshot) {
			factionsId = snapshot.val();
			for(var id in factionsId) {
				if(id != ComsysInfo.getFactionID()){
					pushFirebase(id);
				}
			}
		});

		function pushFirebase(id) {
			var special_actRef = new Firebase(firebaseUrl + "events_in_progress/"
				+ ComsysInfo.getEventID() + "/factions/" + id + "/special_actions");
			special_actRef.push({
				action: "systemhack", 
				timestamp: Firebase.ServerValue.TIMESTAMP
			});
		};
	};

	$scope.activateSystemHack = function() {
		$location.path('/systemhack');
	};
	
});
