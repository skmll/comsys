app.controller('MenuCtrl', function ($scope, $ionicModal, $ionicLoading, ComsysInfo, $location, $q, ComsysStubService) {

	$scope.isLogged = ComsysInfo.getIsLogged();

	$scope.factionsId = [];

	$scope.deferred = $q.defer();

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
		/*
        var loadingLogin = $ionicLoading.show({
            content: 'Saving login information',
            showBackdrop: false
        });
		 */
		ComsysStubService.loginComsys($scope.loginData.username, $scope.loginData.password)
		.success(function (data) {
			console.log(data);
			ComsysInfo.loginComsys(data.response);
			$scope.closeLoginModal();
		})
		.error(function (error) {
			$scope.loginComsysResult = 'Unable to load data: ' + error;
		});
		
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

	$scope.retrieveFactions = function() {
		var ref = new Firebase("https://socom-bo-estg-2015.firebaseio.com/events_in_progress/1/factions/");
		ref.on("value", function(snapshot) {
			$scope.factionsId = snapshot.val();

			$scope.deferred.resolve();
			return $scope.deferred.promise;
		}, 
		function(error, snapshot) { 
			console.log("ola");
			$scope.deferred.reject();
		});
	};

	$scope.sendSystemHack = function() {
		$scope.retrieveFactions();

		$scope.deferred.promise.then(
				function(success) {
					for(var id in $scope.factionsId) {
						$scope.pushFirebase(id);
					}
				},
				function(error) {
					alert("Something wrong: " + error);
				});
	};

	$scope.pushFirebase = function(id) {
		var special_actRef = new Firebase("https://socom-bo-estg-2015.firebaseio.com/events_in_progress/1/factions/" + id + "/special_actions");
		special_actRef.push({action: "systemhack", timestamp: Firebase.ServerValue.TIMESTAMP},
				function(error) {   
			if(error) {
				alert("Problem: " + error);
			} else {
				alert("Success!");
			}
		});
	};

	$scope.activateSystemHack = function() {

		$location.path('/systemhack');
	};
});