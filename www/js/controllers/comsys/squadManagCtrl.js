/**
 * Created by joaosilva on 25/05/15.
 */
app.controller('SquadManagCtrl', function ($scope, $ionicModal, $timeout, $ionicLoading, $ionicPopup) {
    $scope.groups = [];
    for (var i=0; i<10; i++) {
        $scope.groups[i] = {
            name: i,
            items: []
        };
        for (var j=0; j<3; j++) {
            $scope.groups[i].items.push(i + '-' + j);
        }
    }

    $scope.teste = function(group){

            $scope.array1 = [];
            var xpto = 0;
            for (var i=0; i<10; i++) {
                console.log("Grupo     :  " + group.name);
                if(group.name != i) {
                    xpto++;
                    console.log("i: " + i);
                    $scope.array1.push({name: i});
                }

            }

            /*$scope.array1.forEach(function(item) {
                console.log("Parametros " + item.name);
            })*/

            console.log("Tamanho: " + $scope.array1.length);

            $scope.squadAvailable = $ionicPopup.show({
                controller: 'SquadManagCtrl',
                template: '<button class="button button-block button-positive" ng-repeat="group1 in array1">{{group1.name}}</button>'
                + '<button class="button button-block button-assertive" ng-click="closeKnowTextPopup()">Cancel</button>',
                title: 'Choose message',
                subTitle: 'Please choose one of the displayed messages.',
                scope: $scope
            });
            $timeout(function () {
                $scope.closeKnowTextPopup();
            }, 5000);


    }

    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
            console.log("Grupo: "+group.name);
        }
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };

    $scope.closeKnowTextPopup = function () {
        $scope.squadAvailable.close();
    };

});
