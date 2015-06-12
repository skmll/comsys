app.controller('MapCtrl', function ($scope, $ionicModal, $ionicLoading, ComsysInfo) {

    $scope.notifications = [];
    $scope.notificationsOld = [];

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
                        $scope.notifications.push({id: id, sender: notifs[id].sender, text: notifs[id].text, time: myDate});
                    }else {
                        $scope.notificationsOld.push({id: id, sender: notifs[id].sender, text: notifs[id].text, time: myDate});
                    }
               });
            }else {
                if(notifs[id].seen == undefined || notifs[id].seen == 'false'){
                    $scope.notifications.push({id: id, sender: notifs[id].sender, text: notifs[id].text, time: myDate});
                }else {
                    $scope.notificationsOld.push({id: id, sender: notifs[id].sender, text: notifs[id].text, time: myDate});
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

    $scope.showBody = true;


    $scope.typeNotification = [
        {text: "OK", checked: true},
        {text: "WILCO" , checked: true},
        {text: "ROGER", checked: true},
        {text: "Radio Check", checked: true},
        {text: "Positive", checked: true},
        {text: "Negative", checked: true}
    ];


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
        $scope.modalNewNotifications.show();
    };

    /// Close the answer notifications Modal
    $scope.closeAnswerNotificationsModal = function () {
        $scope.modalNotifications.hide();
    };

    // Open the answer notifications Modal
    $scope.openAnswerNotificationsModal = function (notifi) {
        console.log("Texto Notificação: " + notifi)
        $scope.modalNotifications.show();
        $scope.notifiText = notifi;
    };

    // Triggered in the login modal to close it
    $scope.closeModalNotificationSeeAll = function () {
        $scope.modalNotificationsSeeAll.hide();
    };

    // Open the login modal
    $scope.openModalNotificationSeeAll = function () {
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