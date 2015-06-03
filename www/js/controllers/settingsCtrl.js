/**
 * Created by joaosilva on 25/05/15.
 */
app.controller('SettingsCtrl', function ($scope, $ionicLoading, $timeout) {

    // Set userLogged - 0:Not logged 1:Logged
    //$scope.isLogged = AppService.getIsLogged();

    // Set inSquad - 0:Not in squad 1:In squad
   // $scope.inSquad = AppService.getInSquad();

    $scope.saveIPs = function () {
        $scope.loadingSaveIPs = $ionicLoading.show({
            content: 'Saving server IPs information',
            showBackdrop: false
        });
        $timeout(function () {
            $scope.loadingSaveIPs.hide();
        }, 1000);
    };
});