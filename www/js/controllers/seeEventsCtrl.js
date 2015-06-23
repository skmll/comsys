app.controller('SeeEventsCtrl', function ($scope, ComsysInfo, CommonStubService) {

	$scope.getAllEvents = CommonStubService.getAllEvents()
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
			$scope.eventsList = data.list;
		}
	})
	.error(function (error) {
		// Bad result
		ComsysInfo.buildAlertPopUp('Unable to get all events',
				'Unable to get all events: ' + error);
	});

	$scope.eventID = ComsysInfo.getEventID();

	$scope.goToEvent = function(event) {
		ComsysInfo.setEventSelected(event);
	};

});
