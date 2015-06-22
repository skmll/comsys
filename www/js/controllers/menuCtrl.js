app.controller('MenuCtrl', function ($scope, $ionicModal, $ionicLoading, $location, ComsysInfo, ComsysStubService) {

	var firebaseUrl = "https://socom-bo-estg-2015.firebaseio.com/";
	var serverError = 0;
	
	// Update ID of logged user
	$scope.isLogged = ComsysInfo.getIsLogged();

	// Set eventID
    $scope.eventID = ComsysInfo.getEventID();
	
	// Refresh menu
	$scope.refreshMenu = function() {
		// Update ID of logged user
		$scope.isLogged = ComsysInfo.getIsLogged();
	};

	/* Login */

	// Form data for the login modal
	$scope.loginData = {
		username:"",
		password:""
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
					
					// Update login information on service and menu state
					ComsysInfo.loginComsys(data.response);
					registerFirebaseReferences();
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
		
		ComsysInfo.createComsys();
		$ionicLoading.hide();
		$scope.closeSignUpModal();
		}
	};

	/* UAV */

	$scope.useUAV = function() {
		var factionsId = [];
		var ref = new Firebase(firebaseUrl + "events_in_progress/" 
				+ ComsysInfo.getEventID() + "/factions/");
		ref.once("value", function(snapshot) {
			factionsId = snapshot.val();
			for(var id in factionsId) {
				if(id != ComsysInfo.getFactionID()){
					getAllOperators(id);
				}
			}
		});

		function getAllOperators(factionID) {
			var operators = [];
			var ref = new Firebase(firebaseUrl + "events_in_progress/" 
					+ ComsysInfo.getEventID() + "/factions/" + factionID + "/operators/");
			ref.once("value", function(snapshot) {
				operators = snapshot.val();
				for (var id in operators) {
					console.log(operators[id]);
					ComsysStubService.addEnemyPing(ComsysInfo.getEventID(), ComsysInfo.getFactionID(), 
						operators[id].gps.lat, operators[id].gps.lng);
				}				
			});
		};
	};


	/* System Hack */
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


	function registerFirebaseReferences(){
		var notificationsRef = new Firebase(firebaseUrl + 'events_in_progress/' + ComsysInfo.getEventID() + '/factions/'
			+ ComsysInfo.getFactionID() + '/comsys_users/' + ComsysInfo.getIsLogged() + '/comsys_notifications');
		notificationsRef.on('child_added', function(childSnapshot, prevChildName){
			console.log(childSnapshot.val());
			//TODO: add to list to present in view
		});
		var specActRef = new Firebase(firebaseUrl + 'events_in_progress/' + ComsysInfo.getEventID() + '/factions/'
			+ ComsysInfo.getFactionID() + '/special_actions/');
		specActRef.on('child_added', function(childSnapshot, prevChildName){
			console.log(childSnapshot.val());
			var specialAction = childSnapshot.val();

			var diffMilSec = new Date().getTime() - specialAction.timestamp;
			//TODO: change this actionDuration to the one specific to the action
			var actionDuration = 600000;

			if(specialAction.action == 'systemhack' && diffMilSec < actionDuration){
				$location.path('/systemhack');
			}else if(specialAction.action == 'enemy' && diffMilSec < actionDuration){
				//TODO: call map method to add ping visually
				console.log('enemy', specialAction);
			}
		});
	};

	$scope.sendNotification = function(text, receiver) {
		// TEST DATA
		var receiver = {
			id: 1,
			type: 'comsys'
		};
		var text = Math.random().toString(36).replace(/[^a-z]+/g, '');

	    var test_availArray = [
	        {text: "OK", checked: true},
	        {text: "WILCO" , checked: true},
	        {text: "ROGER", checked: true},
	        {text: "Radio Check", checked: true},
	        {text: "Positive", checked: true},
	        {text: "Negative", checked: true}
	    ];

        var available_responses_list = [];

        for (var i = 0; i < test_availArray.length; i++) {
            if(test_availArray[i].checked){
                available_responses_list.push(test_availArray[i].text);
            }
        };

		var sender = {
			id: ComsysInfo.getIsLogged(),
			name: 'WhateverWorks',
			type: 'comsys'
		};
		

		if(receiver.type == 'comsys'){
			ComsysStubService.sendNotificationToComsys(ComsysInfo.getEventID(), ComsysInfo.getFactionID(), receiver.id, 
				available_responses_list, sender, text);
		}else if(receiver.type == 'squad'){
			ComsysStubService.sendNotificationToSquad(ComsysInfo.getEventID(), ComsysInfo.getFactionID(), receiver.id, 
				available_responses_list, sender, text);
		}else if(receiver.type == 'faction'){
			ComsysStubService.sendNotificationToFaction(ComsysInfo.getEventID(), ComsysInfo.getFactionID(), 
				available_responses_list, sender, text);
		}else if(reciver.type == 'operator'){
			ComsysStubService.sendNotificationToOperator(ComsysInfo.getEventID(), ComsysInfo.getFactionID(), receiver.id, 
				available_responses_list, sender, text);
		}
		
	};
	
	function registerFirebaseReferences(){
		var notificationsRef = new Firebase(firebaseUrl + 'events_in_progress/' + ComsysInfo.getEventID() + '/factions/'
			+ ComsysInfo.getFactionID() + '/comsys_users/' + ComsysInfo.getIsLogged() + '/comsys_notifications');
		notificationsRef.on('child_added', function(childSnapshot, prevChildName){
			console.log(childSnapshot.val());
			//TODO: add to list to present in view
		});
		var specActRef = new Firebase(firebaseUrl + 'events_in_progress/' + ComsysInfo.getEventID() + '/factions/'
			+ ComsysInfo.getFactionID() + '/special_actions/');
		specActRef.on('child_added', function(childSnapshot, prevChildName){
			console.log(childSnapshot.val());
			var specialAction = childSnapshot.val();

			var diffMilSec = new Date().getTime() - specialAction.timestamp;
			//TODO: change this actionDuration to the one specific to the action
			var actionDuration = 600000;

			if(specialAction.action == 'systemhack' && diffMilSec < actionDuration){
				$location.path('/systemhack');
			}else if(specialAction.action == 'enemy' && diffMilSec < actionDuration){
				//TODO: call map method to add ping visually
				console.log('enemy', specialAction);
			}
		});
	};

});
