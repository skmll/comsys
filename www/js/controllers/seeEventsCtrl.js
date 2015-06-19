app.controller('SeeEventsCtrl', function ($scope, ComsysInfo) {

	// User Statos (0 - not logged, 1 - logged)
	$scope.isLogged = ComsysInfo.getIsLogged();

    $scope.eventID = ComsysInfo.getEventID();

    $scope.eventsList = ComsysInfo.getAllEvents();

    $scope.goToEvent = function(event) {
        EventsInfo.setEventSelected(event);
    };
    
});
