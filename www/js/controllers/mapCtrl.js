app.controller('MapCtrl', function ($scope, $ionicModal, $ionicNavBarDelegate , $ionicLoading, $ionicHistory, $state, Hostile, ComsysInfo, CommonStubService, ComsysStubService, CoordinatesConverter, Squad, Operator, Specialization) {

    $scope.notifications = [];
    $scope.notificationsOld = [];

    $scope.showBody = true;
    $scope.showItemsAnswer = true;
    $scope.showItemsCreate = true;

    $scope.typeNotification = [
        {text: "OK", checked: true},
        {text: "WILCO" , checked: true},
        {text: "ROGER", checked: true},
        {text: "Radio Check", checked: true},
        {text: "Positive", checked: true},
        {text: "Negative", checked: true}
    ];

    $scope.username = "";

    var operatorsToAdd = [];
    var converter = new CoordinatesConverter();
    var firebaseUrl = "https://socom-bo-estg-2015.firebaseio.com/events_in_progress/";
    
    // DO NOT DELETE, i need global access to this ref
    var ref;

    ComsysInfo.setAfterLogInOutMapCallback(function(){
        $scope.username = ComsysInfo.getUsername();
    });


    // register a callback with the service that gets called after go live
    ComsysInfo.setAfterGoLiveMapCallback(function(){
        /*########################          START OF SPECIAL ACTIONS      #############################*/
        var specActRef = new Firebase(firebaseUrl + ComsysInfo.getEventID() + '/factions/'
                + ComsysInfo.getFactionID() + '/special_actions/');
        specActRef.on('child_added', function(childSnapshot, prevChildName){
            console.log(childSnapshot.val());
            var specialAction = childSnapshot.val();

            var diffMilSec = new Date().getTime() - specialAction.timestamp;
            //change this actionDuration to the one specific to the action
            var actionDuration = 600000;

            if(specialAction.action == 'systemhack' && diffMilSec < actionDuration){
                $location.path('/systemhack');
            }
        });
        /*########################          END OF SPECIAL ACTIONS      #############################*/


        /*########################          START OF GAME STATE      #############################*/
        ComsysStubService.checkGameState(ComsysInfo.getEventID(), function(data) {
            ComsysInfo.setGameState(data);
        });
        /*########################          END OF GAME STATE      #############################*/


        /*########################          START OF NOTIFICATIONS      #############################*/
        ref = new Firebase(firebaseUrl + ComsysInfo.getEventID() + "/factions/" + ComsysInfo.getFactionID() + "/comsys_users/"
            + ComsysInfo.getIsLogged() + "/comsys_notifications");
        // Attach an asynchronous callback to read the data at our squads reference
        ref.on("value", callbackNotifFirebase);
        /*########################          END OF NOTIFICATIONS        #############################*/


        /*########################          START OF MAP DEFINITION      #############################*/
        CommonStubService.getMap(ComsysInfo.getEventID())
        .success(function (data) {
            console.log("getMap", data);
            // Converter from DMS to DD coordinates (needed by the map)
            var requestResult = data.list;
            var coordinates = []; //LatLng

            angular.forEach(requestResult, function (coordinate) {
                converter.latitude.setDMS(coordinate.lat_d, coordinate.lat_m, coordinate.lat_s, coordinate.lat_c);
                converter.longitude.setDMS(coordinate.lng_d, coordinate.lng_m, coordinate.lng_s, coordinate.lng_c);
                coordinates.push(new L.LatLng(converter.getLatitude(), converter.getLongitude()));
            });

            // After processing the coordinates on the foreach, pass the coordinates to the map object !!!!!
            $scope.map.setGameZone(coordinates);

            /*########################          START OF ENEMY PINGS          #############################*/
            ComsysStubService.onFactionEnemyPingAdded(ComsysInfo.getEventID(), ComsysInfo.getFactionID(), function(hostile){
                //console.log("HOSTILEEEEEE", hostile);

                $scope.map.addHostile(new Hostile(hostile.gps_lat, hostile.gps_lng, hostile.enemies_number, hostile.direction, hostile.timestamp));
            });
            /*########################          END OF ENEMY PINGS          #############################*/


            /*########################          START OF MAP SQUADS         #############################*/
            ComsysStubService.onSquadsIdsChanged(ComsysInfo.getEventID(), ComsysInfo.getFactionID(), function(squadId, status){
                if(status == 'added'){
                    console.log('++++++++++++++++++++++++++++++++++++++++++++++++Squad added', squadId);
                    $scope.map.addSquad(new Squad(squadId));
                    if(operatorsToAdd[squadId] === undefined){
                        return;
                    }
                    angular.forEach(operatorsToAdd[squadId], function (operator) {
                        $scope.map.addOperator(squadId, operator);
                    });
                    operatorsToAdd[squadId] = [];
                }else if(status == 'removed') {
                    console.log('------------------------------------------------Squad removed', squadId);
                    $scope.map.removeSquad($scope.map.getSquad(squadId));
                }
            });
            /*########################          END OF MAP SQUADS          #############################*/


            /*########################          START OF OPERATORS         #############################*/
            ComsysStubService.onOperatorValuesChanged(ComsysInfo.getEventID(), ComsysInfo.getFactionID(), function(ops){
                angular.forEach(ops, function (operator) {
                    if($scope.map.getSquad(operator.squad_id) === undefined){
                        if(operatorsToAdd[operator.squad_id] === undefined){
                            operatorsToAdd[operator.squad_id] = [];
                        }
                        operatorsToAdd[operator.squad_id].push(new Operator(operator.nickname, operator.nickname,
                         operator.gps_lat, operator.gps_lng, Specialization.get('INFANTRY')));
                    }else{
                        $scope.map.addOperator(operator.squad_id, new Operator(operator.nickname, operator.nickname,
                         operator.gps_lat, operator.gps_lng, Specialization.get('INFANTRY')));//TODO: map operator.specialization firebase
                    }
                });
            });


            /*########################          END OF OPERATORS          #############################*/


            /*########################          START OF ZONE DEFINITION          #############################*/

            CommonStubService.getAllCommonZones(ComsysInfo.getEventID())
            .success(function (data) {
                console.log("getAllCommonZones", data);
                angular.forEach(data.list, function (eventZone){ 
                    CommonStubService.getCoordCommonZoneByID(ComsysInfo.getEventID(), eventZone.id)
                    .success(function (data) {
                        console.log("commonZone id: " + eventZone.id, data);
                        var zoneResult = data.list;
                        var zoneCoordinates = []; //LatLng

                        angular.forEach(zoneResult, function (coordinate) {
                            converter.latitude.setDMS(coordinate.lat_d, coordinate.lat_m, coordinate.lat_s, coordinate.lat_c);
                            converter.longitude.setDMS(coordinate.lng_d, coordinate.lng_m, coordinate.lng_s, coordinate.lng_c);
                            zoneCoordinates.push(new L.LatLng(converter.getLatitude(), converter.getLongitude()));
                        });

                        // #####################################################################
                        //add zones to the map
                        $scope.map.addZone(eventZone.id, eventZone.name, zoneCoordinates, eventZone.color);

                    })
                    .error(function (error) {
                        console.log(error);
                    });
                });
            })
            .error(function (error) {
                console.log(error);
            });

            CommonStubService.getAllFactionZones(ComsysInfo.getEventID(), ComsysInfo.getFactionPIN())
            .success(function (data) {
                console.log('getAllFactionZones', data);
                angular.forEach(data.list, function (eventZone){ 
                    CommonStubService.getCoordFactionZonesByID(ComsysInfo.getEventID(), ComsysInfo.getFactionPIN(), eventZone.id)
                    .success(function (data) {
                        console.log("factionZone id: " + eventZone.id, data);
                        var zoneResult = data.list;
                        var zoneCoordinates = []; //LatLng

                        angular.forEach(zoneResult, function (coordinate) {
                            converter.latitude.setDMS(coordinate.lat_d, coordinate.lat_m, coordinate.lat_s, coordinate.lat_c);
                            converter.longitude.setDMS(coordinate.lng_d, coordinate.lng_m, coordinate.lng_s, coordinate.lng_c);
                            zoneCoordinates.push(new L.LatLng(converter.getLatitude(), converter.getLongitude()));
                        });

                        // #####################################################################
                        //add zones to the map
                        $scope.map.addZone(eventZone.id, eventZone.name, zoneCoordinates, eventZone.color);

                    })
                    .error(function (error) {
                        console.log(error);
                    });
                });
            })
            .error(function (error) {
                console.log(error);
            });

            /*########################          END OF ZONE DEFINITION          #############################*/


        })
        .error(function (error) {
            console.log(error);
        });
        /*########################          END OF MAP DEFINITION      #############################*/
    });

    //definition of a callback function as variable since we use it multiple times
    var callbackNotifFirebase = function(snapshot) {
        $scope.notifications = [];
        $scope.notificationsOld = [];
        console.log('notificationRef', snapshot.val());
        var notifs = snapshot.val();
        for(id in notifs){
            var myDate = notifs[id].timestamp == undefined ? 'N/A' : new Date(notifs[id].timestamp).toLocaleString();
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply(function () {
                    if(notifs[id].seen == undefined || notifs[id].seen == 'false'){
                        $scope.notifications.push({id: id, sender: notifs[id].sender, text: notifs[id].text, time: myDate, available_responses_list: notifs[id].available_responses_list});
                    }else {
                        $scope.notificationsOld.push({id: id, sender: notifs[id].sender, text: notifs[id].text, time: myDate, available_responses_list: notifs[id].available_responses_list});
                    }
               });
            }else {
                if(notifs[id].seen == undefined || notifs[id].seen == 'false'){
                    $scope.notifications.push({id: id, sender: notifs[id].sender, text: notifs[id].text, time: myDate, available_responses_list: notifs[id].available_responses_list});
                }else {
                    $scope.notificationsOld.push({id: id, sender: notifs[id].sender, text: notifs[id].text, time: myDate, available_responses_list: notifs[id].available_responses_list});
                }} 
        }

    };

    $scope.$on('$ionicView.afterEnter', function() {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      
      
      if(ComsysInfo.getMenuRefresh() && $scope.isLogged == 0) {
          $state.go($state.current, {}, {reload: true});
          ComsysInfo.setMenuRefresh(false);
      }
      
    });
        
    //delete this function after test
    $scope.unDismissAll = function(){
        if($scope.notificationsOld.length == 0 || ref == undefined){
            return;
        }
        var ref2 = new Firebase(firebaseUrl + ComsysInfo.getEventID() + "/factions/" + ComsysInfo.getFactionID() + "/comsys_users/"
            + ComsysInfo.getIsLogged() + "/comsys_notifications");
        ref.off();
        for (var i = 0; i < $scope.notificationsOld.length; i++) {
            var ref2Child = ref2.child($scope.notificationsOld[i].id);
            ref2Child.update({ 
                seen: 'false',
            });
        };
        ref.on('value', callbackNotifFirebase);
        $scope.notificationsOld = [];
    };

    $scope.dismissAll = function(){
        if($scope.notifications.length == 0 || ref == undefined){
            return;
        }
        var ref2 = new Firebase(firebaseUrl + ComsysInfo.getEventID() + "/factions/" + ComsysInfo.getFactionID() + "/comsys_users/"
            + ComsysInfo.getIsLogged() + "/comsys_notifications");
        ref.off();
        for (var i = 0; i < $scope.notifications.length; i++) {
            var ref2Child = ref2.child($scope.notifications[i].id);
            ref2Child.update({ 
                seen: 'true',
            });
        };
        ref.on('value', callbackNotifFirebase);
        $scope.notifications = [];
    };

    $scope.dismissNotif = function(id){
        console.log(id);
        var refNotif = new Firebase(firebaseUrl + ComsysInfo.getEventID() + "/factions/" + ComsysInfo.getFactionID() + "/comsys_users/"
            + ComsysInfo.getIsLogged() + "/comsys_notifications/" + id);
        refNotif.update({
            seen: 'true'
        });
    };

    $scope.sendNotification = function(text, receiver) {
        var available_responses_list = [];

        for (var i = 0; i < $scope.typeNotification.length; i++) {
            if($scope.typeNotification[i].checked){
                available_responses_list.push($scope.typeNotification[i].text);
            }
        };

        var sender = {
            id: ComsysInfo.getIsLogged(),
            name: ComsysInfo.getNickname(),
            type: 'comsys'
        };
        

        if(receiver.type == 'comsys'){
            ComsysStubService.sendNotificationToComsys(ComsysInfo.getEventID(), ComsysInfo.getFactionID(), receiver.id, 
                available_responses_list, sender, text);
        }else if(receiver.type == 'squad'){
            ComsysStubService.sendNotificationToSquad(ComsysInfo.getEventID(), ComsysInfo.getFactionID(), receiver.id, 
                available_responses_list, sender, text);
        }else if(receiver.type == 'faction'){
            ComsysStubService.sendNotificationToFaction(ComsysInfo.getEventID(), ComsysInfo.getFactionID(), 
                available_responses_list, sender, text);
        }else if(receiver.type == 'operator'){
            ComsysStubService.sendNotificationToOperator(ComsysInfo.getEventID(), ComsysInfo.getFactionID(), receiver.id, 
                available_responses_list, sender, text);
        }
        $scope.closeAnswerNotificationsModal();
        $scope.closeNotificationsModal();
    };


    $ionicModal.fromTemplateUrl('templates/newNotification.html', {
        scope: $scope
    }).then(function (modalNewNotifications) {
        $scope.modalNewNotifications = modalNewNotifications;
    });

    $ionicModal.fromTemplateUrl('templates/answerNotifications.html', {
        scope: $scope
    }).then(function (modalNotifications) {
        $scope.modalNotifications = modalNotifications;
    });

    $ionicModal.fromTemplateUrl('templates/seeAll.html', {
        scope: $scope
    }).then(function (modalNotificationsSeeAll) {
        $scope.modalNotificationsSeeAll = modalNotificationsSeeAll;
    });

    // Close the notifications Modal
    $scope.closeNotificationsModal = function () {
        $scope.modalNewNotifications.hide();
    };

    // Open the notifications Modal
    $scope.openNotificationsModal = function () {
        if(ComsysInfo.getIsLogged() == 0){
            ComsysInfo.buildAlertPopUp("Can't send notifications!", 'You need to login first.');
            return;
        }
        $scope.modalNewNotifications.show();
        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });

        ComsysStubService.getComsysAllowedNotifReceiver(ComsysInfo.getEventID(), ComsysInfo.getFactionID(),
         ComsysInfo.getIsLogged(), function(array){
            //$scope.$apply(function () {
                $scope.possibleReceivers = array.reverse();
                console.log($scope.possibleReceivers);
                $ionicLoading.hide();
            //});
        });

    };

    /// Close the answer notifications Modal
    $scope.closeAnswerNotificationsModal = function () {
        $scope.modalNotifications.hide();
    };

    // Open the answer notifications Modal
    $scope.openAnswerNotificationsModal = function (notifi) {
        console.log("Texto Notificação: ", notifi);
        $scope.modalNotifications.show();
        $scope.notifi = notifi;
    };

    // Triggered in the login modal to close it
    $scope.closeModalNotificationSeeAll = function () {
        $scope.modalNotificationsSeeAll.hide();
    };

    // Open the login modal
    $scope.openModalNotificationSeeAll = function () {
        if($scope.notificationsOld.length == 0){
            ComsysInfo.buildAlertPopUp('No notifications!', "You don't have old notifications.");
            return;
        }
        $scope.modalNotificationsSeeAll.show();
    };

    $scope.goToProfileOrOpenLoginModal = function(){
        //console.log("asdasdasdas", $scope.username);
        if($scope.username == ''){
            ComsysInfo.openLoginModal();
        }else{
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $state.go('app.profile');
        }
    };


    /*
    *
    *       Daqui para baixo SOCOM-MAPS
    *
    */

    $scope.mapCreated = function (map) {
        $scope.map = map;
    };


    //Callback from notifications on map -> make call to firebase
    $scope.$on('enemyDetected', function (event, hostile) {
        //console.log(hostile);
        ComsysStubService.addEnemyPing(ComsysInfo.getEventID(), ComsysInfo.getFactionID(), hostile.latitude, hostile.longitude,
            hostile.enemiesNumber, hostile.direction);
    });

});