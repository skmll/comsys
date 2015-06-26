app.controller('SeeEventsCtrl', function ($scope, ComsysInfo, CommonStubService) {

	$scope.isLogged = ComsysInfo.getIsLogged();

	CommonStubService.getAllEvents()
	.success(function (data) {
		if (data.response == 0) {
			var aux = "";
			for (var key in data.errors) {
				if (data.errors.hasOwnProperty(key)) {
					aux = aux + data.errors[key];
				}	
			}
			// Bad result
			ComsysInfo.buildAlertPopUp('Unable to get all events',
					'Unable to get all events: ' + aux);
		}else{
			var allEvents = data.list;
			for (var i = 0; i < allEvents.length; i++) {

				if(ComsysInfo.isComsysRegisteredInEvent(allEvents[i].id)){
					$scope.registeredEvents.push(allEvents[i]);
				}else{
					$scope.notRegisteredEvents.push(allEvents[i]);
				}

			};
			//$scope.allEvents = allEvents;
			//ComsysInfo.setEvents($scope.allEvents);
		}
	})
	.error(function (error) {
		// Bad result
		ComsysInfo.buildAlertPopUp('Error',
		'Unable to get all events, please login first.');
	});

	$scope.goToRegisteredEvent = function(event) {
		event.registered = true;
		var eventRegistered = ComsysInfo.getEventIdsOfRegisteredEvent(event.id);
		event.factionID = eventRegistered.faction_id;
		event.factionPIN = eventRegistered.faction_pin;
		ComsysInfo.setEventSelected(event);
	};

	$scope.goToNotRegisteredEvent = function(event) {
		event.registered = false;
		ComsysInfo.setEventSelected(event);
	};

});
