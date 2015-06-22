/**
 * Created by joaosilva on 26/05/15.
 */
app.controller('MapCtrl', function ($scope, $ionicLoading, $ionicNavBarDelegate, $ionicHistory, $rootScope, $state, ComsysInfo) {

    $scope.teste = false;

    $scope.notifications = function () {
        if($scope.teste == true){
            $scope.teste = false;
        }else {
            $scope.teste = true;
        }
        console.log("Teste: " + $scope.teste);
    };

    $scope.$on('$ionicView.afterEnter', function() {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      
      
      if(ComsysInfo.getMenuRefresh() && $scope.isLogged == 0) {
          $state.go($state.current, {}, {reload: true});
          ComsysInfo.setMenuRefresh(false);
      }
      
    });

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

});