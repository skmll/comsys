app.controller('EventDetailsCtrl', function ($scope, ComsysInfo, $ionicHistory, $ionicPopup, $ionicLoading, ComsysStubService, $location) {
	
	$scope.factionPIN;

	$scope.isLogged = ComsysInfo.getIsLogged();

	$scope.eventSelected = ComsysInfo.getEventSelected();
	
	//$scope.isComsysRegistered = ComsysInfo.isComsysRegistered();
	
	//var selectedEventIds = ComsysInfo.getSelectedEventIds();
	
	$scope.hasEventStarted = ComsysInfo.hasSelectedEventStarted();

	$scope.isEventLive = ComsysInfo.isSelectedEventLive();

	$scope.myGoBack = function() {
		$ionicHistory.goBack();
	};

	$scope.showJoinEventPopup = function () {
		$scope.data = {};
		var joinEventPopup = $ionicPopup.show({
			template: '<input type="tel" ng-model="data.pinEvent">',
			title: 'Enter event PIN',
			subTitle: 'Please enter four digit PIN',
			scope: $scope,
			buttons: [
			{ text: 'Cancel' },
			{
				text: '<b>Save</b>',
				type: 'button-positive',
				onTap: function(e) {
					if ($scope.data.pinEvent < 1000 && $scope.data.pinEvent > 9999) {
			        			  //don't allow the user to close unless he enters pin
			        			  e.preventDefault();
			        			} else {
			        				if ($scope.data.pinEvent < 1000 && $scope.data.pinEvent > 9999) {
			        					e.preventDefault();
			        				}else{
			        					return $scope.data.pinEvent;
			        				}
			        			}
			        		}
			        	}
			        	]
			        });
		joinEventPopup.then(function(res) {
			$scope.factionPIN = res;
			console.log($scope.factionPIN);
			$scope.doJoinEvent();
		});
		// closes loading spin
		$ionicLoading.hide();
	};

	$scope.doJoinEvent = function () {
		var loadingJoinEvent = $ionicLoading.show({
			content: 'Saving join event information',
			showBackdrop: false
		});
		//var aux = ComsysInfo.getEventSelected();
		if ($scope.eventSelected != null) {
			if ($scope.factionPIN > 999 && $scope.factionPIN < 10000) {
				//Join to an event
				ComsysStubService.joinFactionComsys($scope.eventSelected.id, $scope.factionPIN)
				.success(function (data) {
					// closes loading spin
					$ionicLoading.hide();
					console.log(data.response);
					if (data.response == 0) {
						var aux = "";
						for (var key in data.errors) {
							if (data.errors.hasOwnProperty(key)) {
								aux = aux + data.errors[key];
							}
						}
						// Bad result
						ComsysInfo.buildAlertPopUp('Unable to enter in this event',
							aux);
					}else{
						//Comsys enter in a event successfully
						//ComsysInfo.setPinEvent($scope.factionPIN);
						ComsysStubService.getEventsOfComsys()
						.success(function (data) {
							ComsysInfo.setEventsIdsComsysRegistered(data.list);
							$scope.eventSelected = ComsysInfo.joinEvent();
							ComsysInfo.buildAlertPopUp('New event',
								'Welcome to the event.');
						})
						.error(function (error) {
							ComsysInfo.buildAlertPopUp('New event',
								'You successfully joined the event, but there were some errors while getting the event\'s info.');
						});
					}
				})
				.error(function (error) {
					console.log(data.response);
					// closes loading spin
					$ionicLoading.hide();
				});
			} else {
				ComsysInfo.buildAlertPopUp('Invalid PIN',
					'Please enter a valid four digit PIN');
			}
		}else{
			ComsysInfo.buildAlertPopUp('Something went wrong',
				'Something went wrong. Unable to get event ID.');
		}
	};


	$scope.goLiveEvent = function(){
		ComsysInfo.goLive();
		$scope.isEventLive = ComsysInfo.isSelectedEventLive();
		//$location.path('app/map');
	};

	$scope.leaveEvent = function () {
		//console.log('Leaving event:', $scope.eventSelected);
		ComsysStubService.leaveFactionComsys($scope.eventSelected.id, $scope.eventSelected.factionPIN)
		.success(function (data) {
			if (data.response == 0) {
				var aux = "";
				for (var key in data.errors) {
					if (data.errors.hasOwnProperty(key)) {
						aux = aux + data.errors[key];
					}
				}
				// Bad result
				ComsysInfo.buildAlertPopUp('Unable leave the event',
					aux);
			}else{
				//Comsys left the event successfully
				$scope.eventSelected = ComsysInfo.leaveEvent();
				ComsysInfo.buildAlertPopUp('Event',
					'You left the event.');
				//$location.path('app/seeEvents');
				
			}
		})
		.error(function (error) {
		});
	};

});
