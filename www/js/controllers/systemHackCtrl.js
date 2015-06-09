app.controller('systemHackCtrl', function($scope, $timeout, $ionicHistory) {

var returnLastView = function() {
$ionicHistory.goBack();
};

$scope.endSystemHack = function() {
$timeout(returnLastView, 3000);
};

});