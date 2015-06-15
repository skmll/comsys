app.controller('MenuCtrl', function ($scope, $ionicModal, $ionicLoading, ComsysInfo, $location, ComsysStubService) {

	var firebaseUrl = "https://socom-bo-estg-2015.firebaseio.com/";

	// User Statos (0 - not logged, 1 - logged)
	$scope.isLogged = ComsysInfo.getIsLogged();

	$scope.refreshMenu = function() {
		// User Statos (0 - not logged, 1 - logged)
		$scope.isLogged = ComsysInfo.getIsLogged();
	}

	/* Login */

	// Form data for the login modal
	$scope.loginData = {
			username:"",
			password:""
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
		
		/* for home testing */
		//registerFirebaseReferences();
		//ComsysInfo.loginComsys(1);
		
		
		var loadingLogin = $ionicLoading.show({
			content: 'Saving login information',
			showBackdrop: false
		});
		ComsysStubService.loginComsys($scope.loginData.username, $scope.loginData.password)
		.success(function (data) {
			console.log(data);
			ComsysInfo.loginComsys(data.response);
			if(data.response != 0){
				//If login is successful register firebase references
				registerFirebaseReferences();
			}
			$ionicLoading.hide(); 
		})
		.error(function (error) {
			$ionicLoading.hide();
			ComsysInfo.buildAlertPopUp('Unable to login',
			'Unable to login = ');
		});
		
		$scope.closeLoginModal();
		
	};

	/* Sign up */

	$scope.signUpData = {
			// Form data for the sign up modal
			username:"",
			password:"",
			repeatPassword:"",
			nickname:""
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
		$ionicLoading.hide();
		$scope.closeSignUpModal();
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

});
