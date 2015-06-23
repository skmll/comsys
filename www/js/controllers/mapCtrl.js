app.controller('MapCtrl', function ($scope, $ionicModal, $ionicLoading, $ionicHistory, $state, Hostile, ComsysInfo, CommonStubService, ComsysStubService, CoordinatesConverter, Squad, Operator, Specialization) {

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


    var firebaseUrl = "https://socom-bo-estg-2015.firebaseio.com/events_in_progress/";
    
    // DO NOT DELETE, i need global access to this ref
    var ref;

    // register a callback with the service that gets called after log in
    ComsysInfo.setAfterLogginMapCallback(function(){
        ref = new Firebase(firebaseUrl + ComsysInfo.getEventID() + "/factions/" + ComsysInfo.getFactionID() + "/comsys_users/"
            + ComsysInfo.getIsLogged() + "/comsys_notifications");
        // Attach an asynchronous callback to read the data at our squads reference
        ref.on("value", callbackFirebase);


        /*########################          START OF ENEMY PINGS          #############################*/
        ComsysStubService.onFactionEnemyPingAdded(ComsysInfo.getEventID(), ComsysInfo.getFactionID(), function(hostile){
            console.log("HOSTILEEEEEE", hostile);
            // this method should be replaced by a call to the firebase and should only be called when an Hostile notification from the firebase is received
            $scope.map.addHostile(new Hostile(hostile.gps_lat, hostile.gps_lng, hostile.enemies_number, hostile.direction));
            //alert("Hostile Number:" + hostile.enemiesNumber + "\nDirection: " + hostile.direction);
        });
        /*########################          END OF ENEMY PINGS          #############################*/


        /*########################          START OF ZONE DEFINITION          #############################*/

        var converter = new CoordinatesConverter();

        CommonStubService.getMap(ComsysInfo.getEventID())
        .success(function (data) {
            //console.log("111111111111", data);
            // Converter from DMS to DD coordinates (needed by the map)
            var requestResult = data.list; //TODO: data.list ?
            var coordinates = []; //LatLng

            angular.forEach(requestResult, function (coordinate) {
                converter.latitude.setDMS(coordinate.lat_d, coordinate.lat_m, coordinate.lat_s, coordinate.lat_c);
                converter.longitude.setDMS(coordinate.lng_d, coordinate.lng_m, coordinate.lng_s, coordinate.lng_c);
                coordinates.push(new L.LatLng(converter.getLatitude(), converter.getLongitude()));
            });

            // After processing the coordinates on the foreach, pass the coordinates to the map object !!!!!
            $scope.map.setGameZone(coordinates);
        })
        .error(function (error) {
            console.log(error);
        });

        CommonStubService.getAllCommonZones(ComsysInfo.getEventID())
        .success(function (data) {
            //console.log("222222222222222", data);
            angular.forEach(data.list, function (eventZone){ //TODO: data.list?
                CommonStubService.getCoordCommonZoneByID(ComsysInfo.getEventID(), eventZone.id)
                .success(function (data) {
                    //console.log("33333333333", data);
                    var zoneResult = data.list; //TODO: data.list?
                    var zoneCoordinates = []; //LatLng

                    angular.forEach(zoneResult, function (coordinate) {
                        converter.latitude.setDMS(coordinate.lat_d, coordinate.lat_m, coordinate.lat_s, coordinate.lat_c);
                        converter.longitude.setDMS(coordinate.lng_d, coordinate.lng_m, coordinate.lng_s, coordinate.lng_c);
                        zoneCoordinates.push(new L.LatLng(converter.getLatitude(), converter.getLongitude()));
                    });

                    // #####################################################################
                    //add zones to the map
                    $scope.map.addZone(eventZone.id, eventZone.name, zoneCoordinates);

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
            //console.log("444444444", data);
            angular.forEach(data.list, function (eventZone){ //TODO: data.list?
                CommonStubService.getCoordFactionZonesByID(ComsysInfo.getEventID(), ComsysInfo.getFactionPIN(), eventZone.id)
                .success(function (data) {
                    //console.log("5555555555555", data);
                    var zoneResult = data.list; //TODO: data.list?
                    var zoneCoordinates = []; //LatLng

                    angular.forEach(zoneResult, function (coordinate) {
                        converter.latitude.setDMS(coordinate.lat_d, coordinate.lat_m, coordinate.lat_s, coordinate.lat_c);
                        converter.longitude.setDMS(coordinate.lng_d, coordinate.lng_m, coordinate.lng_s, coordinate.lng_c);
                        zoneCoordinates.push(new L.LatLng(converter.getLatitude(), converter.getLongitude()));
                    });

                    // #####################################################################
                    //add zones to the map
                    $scope.map.addZone(eventZone.id, eventZone.name, zoneCoordinates);

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
    });

    //definition of a callback function as variable since we use it multiple times
    var callbackFirebase = function(snapshot) {
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
        
    //TODO: delete this function after test
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
        ref.on('value', callbackFirebase);
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
        ref.on('value', callbackFirebase);
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

        //TODO: change name to real nickname from service
        var sender = {
            id: ComsysInfo.getIsLogged(),
            name: 'Comsys01',
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


    /*
    *
    *       Daqui para baixo SOCOM-MAPS
    *
    */

    $scope.mapCreated = function (map) {
        $scope.map = map;

        /*
        ############################ GAME AREA ############################
        // ------> change this data with the request made by the STUB !!!!!!!
        */
        /*
        var requestResult = [
            {lat_c: "N", lat_d: 39, lat_m: 44, lat_s: 58.57, lng_c: "W", lng_d: 8, lng_m: 48, lng_s: 42.76},
            {lat_c: "N", lat_d: 39, lat_m: 44, lat_s: 50.08, lng_c: "W", lng_d: 8, lng_m: 48, lng_s: 33.8},
            {lat_c: "N", lat_d: 39, lat_m: 44, lat_s: 6.28, lng_c: "W", lng_d: 8, lng_m: 48, lng_s: 57.31},
            {lat_c: "N", lat_d: 39, lat_m: 43, lat_s: 30.24, lng_c: "W", lng_d: 8, lng_m: 47, lng_s: 19.96},
            {lat_c: "N", lat_d: 39, lat_m: 42, lat_s: 15.13, lng_c: "W", lng_d: 8, lng_m: 44, lng_s: 42.23},
            {lat_c: "N", lat_d: 39, lat_m: 42, lat_s: 17.7, lng_c: "W", lng_d: 8, lng_m: 42, lng_s: 42.34},
            {lat_c: "N", lat_d: 39, lat_m: 44, lat_s: 49.28, lng_c: "W", lng_d: 8, lng_m: 41, lng_s: 53.72},
            {lat_c: "N", lat_d: 39, lat_m: 45, lat_s: 47.75, lng_c: "W", lng_d: 8, lng_m: 46, lng_s: 7.38},
            {lat_c: "N", lat_d: 39, lat_m: 44, lat_s: 58.57, lng_c: "W", lng_d: 8, lng_m: 48, lng_s: 42.47}
        ];
        
        var zoneResult = [
            {lat_c: "N", lat_d: 39, lat_m: 43, lat_s: 58.57, lng_c: "W", lng_d: 8, lng_m: 48, lng_s: 42.76},
            {lat_c: "N", lat_d: 39, lat_m: 43, lat_s: 50.08, lng_c: "W", lng_d: 8, lng_m: 48, lng_s: 33.8},
            {lat_c: "N", lat_d: 39, lat_m: 43, lat_s: 6.28, lng_c: "W", lng_d: 8, lng_m: 48, lng_s: 57.31},
            {lat_c: "N", lat_d: 39, lat_m: 42, lat_s: 30.24, lng_c: "W", lng_d: 8, lng_m: 47, lng_s: 19.96},
            {lat_c: "N", lat_d: 39, lat_m: 41, lat_s: 15.13, lng_c: "W", lng_d: 8, lng_m: 44, lng_s: 42.23},
            {lat_c: "N", lat_d: 39, lat_m: 41, lat_s: 17.7, lng_c: "W", lng_d: 8, lng_m: 42, lng_s: 42.34},
            {lat_c: "N", lat_d: 39, lat_m: 43, lat_s: 49.28, lng_c: "W", lng_d: 8, lng_m: 41, lng_s: 53.72},
            {lat_c: "N", lat_d: 39, lat_m: 44, lat_s: 47.75, lng_c: "W", lng_d: 8, lng_m: 46, lng_s: 7.38},
            {lat_c: "N", lat_d: 39, lat_m: 43, lat_s: 58.57, lng_c: "W", lng_d: 8, lng_m: 48, lng_s: 42.47}
        ];
        */



        /*############################ SQUAD #################################*/

        // change the first parameter by the SquadID obtained from the stub
        $scope.map.addSquad(new Squad(1));

        /*####################################################################*/


        /*############################ OPERATORES ############################*/

        // change the first parameter by the SquadID and construct the second parameter from the stub data
        $scope.map.addOperator(1, new Operator(1, 1, 39.73669629664551, -8.727478981018065, Specialization.TRANSPORTATION));
        $scope.map.addOperator(1, new Operator(1, 12, 39.74669629664551, -8.727478981018065, Specialization.MEDIC));

        /*####################################################################*/
    };


    //Callback from notifications on map -> make call to firebase
    $scope.$on('enemyDetected', function (event, hostile) {
        //console.log(hostile);
        ComsysStubService.addEnemyPing(ComsysInfo.getEventID(), ComsysInfo.getFactionID(), hostile.latitude, hostile.longitude,
            hostile.enemiesNumber, hostile.direction);
    });

});