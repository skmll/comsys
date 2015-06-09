/**
 * Created by joaosilva on 26/05/15.
 */
app.controller('MapCtrl', function ($scope, $ionicLoading, $location, $q) {

$scope.factionsId = [];
$scope.deferred = $q.defer();

    $scope.teste = false;

    $scope.notifications = function () {
        if($scope.teste == true){
            $scope.teste = false;
        }else {
            $scope.teste = true;
        }
        console.log("Teste: " + $scope.teste);
    };

    $scope.initialize = function () {
        var myLatlng = new google.maps.LatLng(43.07493, -89.381388);

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Uluru (Ayers Rock)'
        });

        $scope.map = map;
    };
    google.maps.event.addDomListener(document.getElementById("map-canvas"), 'load', $scope.initialize());

    $scope.centerOnMe = function () {
        if (!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });

        //$scope.map.marker.remove();

        navigator.geolocation.getCurrentPosition(function (pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: $scope.map,
                title: 'My Location'
            });
            $scope.loading.hide();
        }, function (error) {
            alert('Unable to get location: ' + error.message);
        });
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
					special_actRef.push({action: "systemhack"},
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