app.controller('MenuCtrl', function ($scope, $ionicModal, $ionicLoading, $location, ComsysInfo, ComsysStubService) {

	var firebaseUrl = "https://socom-bo-estg-2015.firebaseio.com/";
	var serverError = 0;
	
	// Update ID of logged user
	$scope.isLogged = ComsysInfo.getIsLogged();

	// Refresh menu
	$scope.refreshMenu = function() {
		// Update ID of logged user
		$scope.isLogged = ComsysInfo.getIsLogged();
	};
	
	// Reset ID of logged user
	ComsysInfo.resetIsLogged(function() {
		$scope.isLogged = 0;
	});

	/*** Login ***/
	
	// Create the login modal
	$ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $scope
	}).then(function (modalLogin) {
		$scope.modalLogin = modalLogin;
	});
	
	// Open the login modal
	$scope.openLoginModal = function () {
		$scope.modalLogin.show();
	};

	// Close the login modal
	$scope.closeLoginModal = function () {
		$scope.modalLogin.hide();
	};

	// Initialize sign up data
	$scope.loginData = {
			username:"",
			password:""
	};

	// Perform login
	$scope.loginComsys = function () {
		
		// Display loading animation
		$ionicLoading.show({
			content: 'Logging in...',
			showBackdrop: false
		});
		
		// Check if fields are empty
		if ( !$scope.loginData.username || !$scope.loginData.password ) {
			$ionicLoading.hide();
			ComsysInfo.buildAlertPopUp('Login error', 'Username and/or password empty!');
		}
		
		
		else {
			
			// Call stub service to login
			ComsysStubService.loginComsys($scope.loginData.username, $scope.loginData.password)
			
			.success(function (data) {
				
				$ionicLoading.hide();
				console.log(data); //DEBUG
				
				if ( data.response != serverError ) {
					/*
					var notificationsRef = new Firebase(firebaseUrl + 'events_in_progress/' + ComsysInfo.getEventID() + '/factions/'
						+ ComsysInfo.getFactionID() + '/comsys_users/' + data.response + '/comsys_notifications');
					notificationsRef.on('child_added', function(childSnapshot, prevChildName){
						console.log(childSnapshot.val());
						//TODO: add to list to present in view
					});
					*/
					
					// Update login information on service and menu state
					ComsysInfo.loginComsys(data.response);
					ComsysInfo.setMenuRefresh(true);
					
					// Get comsys personal configuration to fill profile
					ComsysInfo.getComsysPersonalConfig($scope);
					
					// Login was successfull -> Display message and close modal
					ComsysInfo.buildAlertPopUp('Login', 'You successfully logged in as '.concat($scope.loginData.username).concat('!'));
					$scope.closeLoginModal();
				}
				
				else {
					// Login was unsuccessfull -> Display error
					$ionicLoading.hide();
					ComsysInfo.buildAlertPopUp('Login error', 'Username and/or password incorrect!');
				}
				
			})
			
			.error(function (error) {
				ComsysInfo.buildAlertPopUp('Server error', 'Unable to log in. Either the server or your internet connection is down.');
			});
			
		}
		
	};

	/*** Sign up ***/
	
	// Create the sign up modal
	$ionicModal.fromTemplateUrl('templates/signUp.html', {
		scope: $scope
	}).then(function (modalSignUp) {
		$scope.modalSignUp = modalSignUp;
	});

	// Open the sign up modal
	$scope.openSignUpModal = function () {
		$scope.modalSignUp.show();
	};

	// Close the sign up modal
	$scope.closeSignUpModal = function () {
		$scope.modalSignUp.hide();
	};

	// Initialize sign up data
	$scope.signUpData = {
		// Form data for the sign up modal
		username:"",
		password:"",
		repeatPassword:"",
		nickname:""
	};
	
	// Perform sign up
	$scope.doSignUp = function () {
		
		// Display loading animation
		$ionicLoading.show({
			content: 'Signing up...',
			showBackdrop: false
		});
		
		
		// Check if Password and RepeatPassword are equal
		if ( !ComsysInfo.verifyRepeatPassword( $scope.signUpData.password, $scope.signUpData.repeatPassword ) ) {
			$ionicLoading.hide();
			ComsysInfo.buildAlertPopUp('Signup Error', "\"Password\" and \"Repeat Password\" don't match!");
		}
		
		else {
		
			// Call stub service to create a new Comsys
			ComsysStubService.createComsys( $scope.signUpData.username, $scope.signUpData.password, $scope.signUpData.nickname )
			
			.success(function (data) {
				
				$ionicLoading.hide();				
				console.log(data); // DEBUG
				
				if ( data.response != serverError ) {
					// Signup was successfull -> Display message and close modals 
					ComsysInfo.buildAlertPopUp('Signup', 'Signup successful! You can now login with the username and password you entered.');
					$scope.closeLoginModal();
					$scope.closeSignUpModal();
				} 
				
				
				else {
					// Signup was unsuccessfull -> Display errors
					var errorMessage = ComsysInfo.getAllErrors(data.errors);
					ComsysInfo.buildAlertPopUp('Signup Error', errorMessage);
				}
				
			})
			
			.error(function (error) {
				$ionicLoading.hide();
				ComsysInfo.buildAlertPopUp('Server error', 'Unable to sign up. Either the server or your internet connection is down.');
			});
		
		}
		
	};

});
