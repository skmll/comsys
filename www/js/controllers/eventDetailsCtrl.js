app.controller('EventDetailsCtrl', function ($scope, ComsysInfo, $ionicHistory, $ionicPopup, $ionicLoading, MasterStubService, $location) {

	$scope.pinEvent = 0;

	$scope.eventSelected = ComsysInfo.getEventSelected();

	$scope.selectedEventID = ComsysInfo.getEventID();

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
			$scope.pinEvent = res;
			console.log($scope.pinEvent);
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
		var aux = ComsysInfo.getEventSelected();
		if (aux != null) {
			if ($scope.pinEvent > 999 && $scope.pinEvent < 10000) {
//				Join to an event
				MasterStubService.joinFactionComsys($scope.selectedEventID, $scope.pinEvent)
				.success(function (data) {
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
//						Comsys enter in a event successfully
						ComsysInfo.setPinEvent($scope.pinEvent);
						ComsysInfo.buildAlertPopUp('New event',
						'Welcome to the event.');
					}
				})
				.error(function (error) {
					console.log(data.response);
				});
			} else {
				ComsysInfo.buildAlertPopUp('Invalid PIN',
				'Please enter a valid four digit PIN');
			}
		}else{
			ComsysInfo.buildAlertPopUp('Something went wrong',
			'Something went wrong. Unable to get event ID.');
		}
		// closes loading spin
		$ionicLoading.hide();
	};

	$scope.liveEvent = function () {
		MasterStubService.leaveFactionComsys($scope.selectedEventID, $scope.pinEvent)
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
//				Comsys left the event successfully
				ComsysInfo.leaveEvent();
				ComsysInfo.buildAlertPopUp('Event',
				'You left the event.');
			}
		})
		.error(function (error) {
		});
		$location.path('app/seeEvents');
		a    };

});
