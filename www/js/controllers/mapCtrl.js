app.controller('MapCtrl', function ($scope, $ionicModal, $ionicLoading, ComsysInfo, ComsysStubService) {

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
            $ionicLoading.hide();
        }, function (error) {
            alert('Unable to get location: ' + error.message);
        });
    };

});