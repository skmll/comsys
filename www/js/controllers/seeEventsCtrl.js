app.controller('SquadManagCtrl', function ($scope, $ionicModal, $ionicLoading, $ionicPopup, ComsysInfo) {
    var loadingSquads = $ionicLoading.show({
            content: 'Loading Squads',
            showBackdrop: false
        });

    $scope.squads = [];

    var firebaseUrl = "https://socom-bo-estg-2015.firebaseio.com/events_in_progress/";

    var selectedOperator;
    var selectedSquadIndex;

    var lastSquads;
    var lastOperators;

    // Get a database reference to our squads
    var ref = new Firebase(firebaseUrl + ComsysInfo.getEventID() + "/factions/" + ComsysInfo.getFactionID() + "/squads");
    // Attach an asynchronous callback to read the data at our squads reference
    ref.on("value", function(snapshot) {
        console.log(snapshot.val());
        lastSquads = snapshot.val();
        convertToSquadArray();
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    var ref2 = new Firebase(firebaseUrl + ComsysInfo.getEventID() + "/factions/" + ComsysInfo.getFactionID() + "/operators");
    // Attach an asynchronous callback to read the data at our operators reference
    ref2.on("value", function(snapshot) {
        console.log(snapshot.val());
        lastOperators = snapshot.val();
        convertToSquadArray();
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    // TEST DATA
    /*
    for (var i=0; i< 10; i++) {
        $scope.squads[i] = {
            name: i,
            operators: []
        };
        for (var j=0; j<3; j++) {
            $scope.squads[i].operators.push(i + '-' + j);
        }
    }
    */
    $scope.openSquadSelectionDialog = function(operator, squadIndex){
        console.log("operator: ", operator);
        console.log("squad idx: ", squadIndex);

        selectedOperator = operator;
        selectedSquadIndex = squadIndex;
        $scope.otherSquads = [];

        var i = 0;
        for (var key in $scope.squads) {
            if(squadIndex != i) {
                //console.log("i: " + i);
                $scope.otherSquads.push($scope.squads[i]);
            }
            i++;
        }

        $scope.squadAvailable = $ionicPopup.show({
            controller: 'SquadManagCtrl',
            template: '<button class="button button-block button-positive" ng-repeat="squad1 in otherSquads" ng-click="moveOperatorToSquad(squad1)">{{squad1.name}}</button>'
            + '<button class="button button-block button-assertive" ng-click="closeSquadSelectionDialog()">Cancel</button>',
            title: 'Choose message',
            subTitle: 'Please choose one of the displayed messages.',
            scope: $scope
        });


    }

    $scope.toggleSquad = function(squad) {
        if ($scope.isSquadShown(squad)) {
            $scope.shownSquad = null;
        } else {
            $scope.shownSquad = squad;
            console.log("Squad: "+squad.name);
        }
    };
    $scope.isSquadShown = function(squad) {
        return $scope.shownSquad === squad;
    };

    $scope.closeSquadSelectionDialog = function () {
        $scope.squadAvailable.close();
    };

    $scope.moveOperatorToSquad = function (squadDestiny) {

        if($scope.squads[selectedSquadIndex].operators.length == 1){
            var squadRef2 = new Firebase(firebaseUrl + ComsysInfo.getEventID() + '/factions/' + ComsysInfo.getFactionID() 
                + '/squads/' + $scope.squads[selectedSquadIndex].id + '/');
            squadRef2.remove();
            $scope.squads.splice(selectedSquadIndex, 1);
        }

        if(lastSquads[squadDestiny.id].leader === undefined){
            var squadRef = new Firebase(firebaseUrl + ComsysInfo.getEventID() + '/factions/' + ComsysInfo.getFactionID() 
            + '/squads/' + squadDestiny.id + '/');
            squadRef.update({
                leader: selectedOperator.id
            });
        }

        var operatorRef = new Firebase(firebaseUrl + ComsysInfo.getEventID() + '/factions/' + ComsysInfo.getFactionID() 
            + '/operators/' + selectedOperator.id + '/');
            operatorRef.update({
                squad_id: squadDestiny.id
            });



        $scope.closeSquadSelectionDialog();

        /*
        var squads = $scope.squads;

        var operator = $scope.squads[selectedSquadIndex].operators.splice(selectedOperatorIndex, 1);

        for (var i=0; i < squads.length; i++) {
            if(squads[i].name == squadDestiny.name){
                squads[i].operators.push(operator[0]);
            }
        }
        */
    };

    $scope.openSquadNameDialog = function () {
         $scope.squadNameDialog = $ionicPopup.show({
            controller: 'SquadManagCtrl',
            template: '<input type="text" ng-model="newSquadName">'
                       + '<button class="button button-block button-positive" ng-click="createSquad(newSquadName)"> Create </button>'
                       + '<button class="button button-block button-assertive" ng-click="closeSquadNameDialog()">Cancel</button>',
            title: 'Squad name:',
            scope: $scope
        });
    };

    $scope.closeSquadNameDialog = function(){
        $scope.squadNameDialog.close();
    }

    $scope.createSquad = function (newSquadName) {
        if(newSquadName === undefined){
            return;
        }
        $scope.closeSquadNameDialog();
        ref.push({
          tag: newSquadName
        });
    }


    function convertToSquadArray() {
        if(lastOperators === undefined || lastSquads === undefined){
            console.log("undefined");
            return;
        }

        for (var key in lastSquads) {
            lastSquads[key].operators = [];
        };

        for (var key in lastOperators) {
           if (lastOperators.hasOwnProperty(key)) {
              var operator = lastOperators[key];
              if(lastSquads[operator.squad_id] === undefined){
                return;
              }
              operator.id = key;
              lastSquads[operator.squad_id].operators.push(operator);
           }
        }
        console.log("after convert:", lastSquads);

        var i = 0;
        for (var key in lastSquads) {
            //console.log("i", i, key, lastSquads[key]);
            //TODO: confirm that below code isnt needed
            /*if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply(function () {
                    $scope.squads[i] = {
                        name: lastSquads[key].tag,
                        operators: lastSquads[key].operators,
                        id: key
                    };
                });
            }else {
            */
                $scope.squads[i] = {
                        name: lastSquads[key].tag,
                        operators: lastSquads[key].operators,
                        id: key
                };
            //}
            i++;
        }

        $ionicLoading.hide();
        console.log("final array", $scope.squads);
    };

});
