var scripts = document.getElementsByTagName("script");
var templatePath = scripts[scripts.length - 1].src.replace('socom-maps.js', 'enemies_modal.html');
var squadsPath = scripts[scripts.length - 1].src.replace('socom-maps.js', 'img/squads/');
var specializationPath = scripts[scripts.length - 1].src.replace('socom-maps.js', 'img/specializations/');
angular.module('socom-maps', [])
    .factory('Direction', function () {

        var direction = {
            NORTH_EAST: {identifier: "ne", rotation: -45},
            NORTH: {identifier: "n", rotation: 0},
            NORTH_WEST: {identifier: "nw", rotation: 45},
            EAST: {identifier: "e", rotation: -90},
            CAMPER: {identifier: "c", rotation: 0},
            WEST: {identifier: "w", rotation: 90},
            SOUTH_EAST: {identifier: "se", rotation: -135},
            SOUTH: {identifier: "s", rotation: -180},
            SOUTH_WEST: {identifier: "sw", rotation: 135}
        };

        direction.get = function (key) {
            return direction[key];
        };


        return direction;
    })
    .factory('EnemiesNumber', function () {

        var enemiesNumber = {
            ONE: "1",
            TWO: "2",
            THREE_FIVE: "3-5",
            FIVE_SEVEN: "5-7",
            PLUS_SEVEN: "+7"
        };

        enemiesNumber.get = function (key) {
            return enemiesNumber[key];
        };


        return enemiesNumber;
    })
    .factory('Hostile', function (Direction) {

        /**
         * Constructor, with class name
         */
        function Hostile(latitude, longitude, enemiesNumber, direction, timestamp) {
            this.id = Math.random();
            this.latitude = latitude;
            this.longitude = longitude;
            this.enemiesNumber = enemiesNumber;
            this.direction = direction;
            this.timestamp = timestamp;
        }

        return Hostile;
    })
    .factory('Map', function (Zone, Squad, Operator, Hostile) {
        /**
         * Constructor, with class name
         */
        function Map(map, gameZoneCallBack, operatorCallback, operatorRemovedCallback, hostileCallBack, hostileRemovedCallback, zoneCallback, zoneRemovedCallback) {
            this.areas = [];
            this.gameZone = new Zone();
            this.squads = [];
            this.map = map;
            this.gameZoneCallBack = gameZoneCallBack;
            this.operatorCallback = operatorCallback;
            this.operatorRemovedCallback = operatorRemovedCallback;
            this.hostileCallBack = hostileCallBack;
            this.hostileRemovedCallback = hostileRemovedCallback;
            this.zoneCallback = zoneCallback;
            this.zoneRemovedCallback = zoneRemovedCallback;
            this.hostiles = [];
        }


        Map.prototype.addHostile = function (hostile) {
            if (!hostile instanceof Hostile) {
                console.log('Trying to add an non Hostile object!!');
            } else {
                this.hostiles[hostile.id] = (hostile);
                if (this.hostileCallBack) {
                    this.hostileCallBack(hostile);
                }
            }
        };
        Map.prototype.removeHostile = function (hostile) {
            if (!hostile instanceof Hostile) {
                console.log('Trying to remove an non Hostile object!!');
            } else {
                this.hostiles.splice(hostile);
                if (this.hostileRemovedCallback) {
                    this.hostileRemovedCallback(hostile);
                }
            }
        };
        Map.prototype.getHostile = function (hostile) {
            return this.hostiles[hostile];
        };


        Map.prototype.addSquad = function (squad) {
            if (!squad instanceof Squad) {
                console.log('Trying to add an non Squad object!!');
            } else {
                this.squads[squad.id] = (squad);
            }
        };
        Map.prototype.removeSquad = function (squad) {
            if (!squad instanceof Squad) {
                console.log('Trying to remove an non Squad object!!');
            }
            this.squads.splice(squad);
        };
        Map.prototype.getSquad = function (squadId) {
            return this.squads[squadId];
        };
        Map.prototype.setGameZone = function (gamezonepoints, color) {
            if (!(gamezonepoints instanceof Array)) {
                console.log('Trying to add an non Array object!!');
            } else {
                //console.log(this.playablearea);
                color = color === undefined ? "#ffffff" : color;
                var success = this.gameZone.setPoints(gamezonepoints, color);
                if (success && this.gameZoneCallBack) {
                    this.gameZoneCallBack(gamezonepoints, color);
                }
            }
        };
        Map.prototype.addZone = function (id, name, playableareapoints, color) {
            if (!(playableareapoints instanceof Array)) {
                console.log('Trying to add an non Array object!!');
            } else {
                //console.log(this.playablearea);
                this.areas[id] = new Zone(id, name, [], color);
                var success = this.areas[id].setPoints(playableareapoints);
                if (success && this.zoneCallback) {
                    this.zoneCallback(this.areas[id]);
                }
            }
        };
        Map.prototype.removeZone = function (id) {
            var area = this.squads[id];
            delete this.squads[id];
            if (this.zoneRemovedCallback) {
                this.zoneRemovedCallback(area);
            }
        };
        Map.prototype.addOperator = function (squadId, operator) {
            if (!operator instanceof Operator) {
                console.log('Trying to add an non Operator object!!');
            } else {
                this.squads[squadId].addOperator(operator);
                if (this.operatorCallback) {
                    this.operatorCallback(operator, squadId);
                }
            }
        };
        Map.prototype.removeOperator = function (squadId, operator) {
            if (!operator instanceof Operator) {
                console.log('Trying to remove an non Operator object!!');
            } else {
                delete this.squads[squadId].removeOperator(operator);
                if (this.operatorRemovedCallback) {
                    this.operatorRemovedCallback(squadId, operator);
                }
            }
        };
        Map.prototype.getOperator = function (squadId, operatorUsername) {
            return this.squads[squadId].operators[operatorUsername];
        };
        return Map;
    })
    .factory('Operator', function () {

        /**
         * Constructor, with class name
         */
        function Operator(username, nickname, latitude, longitude, specialization) {
            this.username = username;
            this.nickname = nickname;
            this.latitude = latitude;
            this.longitude = longitude;
            this.specialization = specialization;
        }

        return Operator;
    })
    .factory('Zone', function () {
        /**
         * Constructor, with class name
         */
        function Zone(id, name, points, color) {
            this.id = id;
            this.name = name;
            this.points = points == undefined ? [] : points;
            this.color = color;
        }

        Zone.prototype.setPoints = function (zonepoints, color) {
            var pointsAux = [];
            this.color = color === undefined ? "#ffffff" : color;
            for (var i = 0; i < zonepoints.length; i++) {
                var point = zonepoints[i];
                if (!(point instanceof L.LatLng)) {
                    console.log('Trying to add an non L.LatLng object!!');
                    return false;
                } else {
                    pointsAux[i] = point;
                }
            }
            this.points = pointsAux;
            return true;
        };
        return Zone;
    })
    .factory('Specialization', function () {

        var specialization = {
            INFANTRY: "infantry.png",
            MEDIC: "medic.png",
            MAINTENANCE: "maintenance.png",
            RECON: "recon.png",
            SIGNALS: "signals.png",
            SOF: "sof.png",
            ENGINEER: "engineer.png",
            RADAR: "radar.png",
            TRANSPORTATION: "transportation.png",
            ARMOUR: "armour.png",
            ANTI_TANK: "anti_tank.png",
            MORTAR: "mortar.png",
            GUNNER: "mortar.png",
            LOADER: "mortar.png",
            ARTELLERY: "artellery.png",
            BRIDGING: "bridging.png",
            NO_SPEC: "no_spec.png"

        };

        specialization.get = function (key) {
            return specialization[key];
        };


        return specialization;
    })
    .factory('Squad', function (Operator) {

        /**
         * Constructor, with class name
         */
        function Squad(id, operators) {
            this.id = id;
            this.operators = {};
            if (!operators instanceof Array) {
                console.log('Trying to add an non Array object!!');
            } else if (operators) {
                for (var i = 0; i < operators.length; i++) {
                    var obj = operators[i];
                    this.addOperator(obj);
                }
            }
        }

        Squad.prototype.addOperator = function (operator) {
            if (!operator instanceof Operator) {
                console.log('Trying to add an non Operator object!!');
            } else {
                this.operators[operator.username] = operator;
            }
        };
        Squad.prototype.removeOperator = function (operator) {
            if (!operator instanceof Operator) {
                console.log('Trying to remove an non Operator object!!');
            }
            delete this.operators[operator.username];
        };
        Squad.prototype.operatorsCount = function () {
            var length = 0;
            for (var property in this.operators) {
                if (this.operators.hasOwnProperty(property)) {
                    length++;
                }
            }
            return length;
        };
        return Squad;
    })
    .factory('CoordinatesConverter', function () {
        function CoordinatesConverter() {
            // Properties
            this._latitude = 0;
            this._longitude = 0;
            this.LATITUDE = 0;
            this.LONGITUDE = 1;
            // Constuctor
            this.latitude = new DMSCalculator(this.LATITUDE, this);
            this.longitude = new DMSCalculator(this.LONGITUDE, this);
            // Methods
            this.setLatitude = function setLatitude(lat) {
                this._latitude = lat;
            };
            this.setLongitude = function setLongitude(lng) {
                this._longitude = lng;
            };
            this.getLatitude = function getLatitude() {
                return this._latitude;
            };
            this.getLongitude = function getLongitude() {
                return this._longitude;
            };

            // SubClasses
            function DMSCalculator(coordSet, object) {
                var degrees = new Array(0, 0);
                var minutes = new Array(0, 0);
                var seconds = new Array(0, 0);
                var direction = new Array(' ', ' ');
                var lastValue = new Array(0, 0);
                var hundredths = new Array(0.0, 0.0);
                var calc = function calc(object) {
                    var val = 0;
                    if (coordSet == object.LATITUDE) {
                        val = object._latitude;
                    } else {
                        val = object._longitude;
                    }
                    if (lastValue[coordSet] != val) {
                        lastValue[coordSet] = val;
                        if (val > 0) {
                            direction[coordSet] = (coordSet == object.LATITUDE) ? 'N' : 'E';
                        }
                        else {
                            direction[coordSet] = (coordSet == object.LATITUDE) ? 'S' : 'W';
                        }
                        val = Math.abs(val);
                        degrees[coordSet] = parseInt(val);
                        var leftover = (val - degrees[coordSet]) * 60;
                        minutes[coordSet] = parseInt(leftover)
                        leftover = (leftover - minutes[coordSet]) * 60;
                        seconds[coordSet] = parseInt(leftover)
                        hundredths[coordSet] = parseInt((leftover - seconds[coordSet]) * 100);
                    }
                };
                this.getDegrees = function getDegrees() {
                    calc(object);
                    return degrees[coordSet];
                };
                this.getMinutes = function getMinutes() {
                    calc(object);
                    return minutes[coordSet];
                };
                this.getSeconds = function getSeconds() {
                    calc(object);
                    return seconds[coordSet];
                };
                this.getDirection = function getDirection() {
                    calc(object);
                    return direction[coordSet];
                };
                this.getHundredths = function getHundredths() {
                    calc(object);
                    return hundredths[coordSet];
                };
                this.getSecondsDecimal = function getSecondsDecimal() {
                    calc(object);
                    return seconds[coordSet] + (hundredths[coordSet] / 100);
                };
                this.setDMS = function setDMS(degrees, minutes, seconds, direction) {
                    var val = parseInt(degrees);
                    val += parseFloat((minutes / 60));
                    val += parseFloat((seconds / 3600));
                    if (direction == 'W' || direction == 'S') {
                        val *= -1;
                    }
                    if (coordSet == object.LATITUDE) {
                        object._latitude = val;
                    } else {
                        object._longitude = val;
                    }
                };
            }
        }

        return CoordinatesConverter;
    })
    .directive('map', function ($ionicLoading, $ionicPopup, $ionicModal, Map, $rootScope, Direction, $timeout) {
        return {
            restrict: 'E',
            scope: {
                mode: '@',
                onCreate: '&'
            },
            link: function ($scope, $element) {
                //<editor-fold desc="On Field">
                var markerGroups = {};
                var modal;
                var operatorsMarkers = {};
                var zonesMarkers = {};
                var hostileMarkers = {};
                var addMarkerEvents = function (map, marker, operatorName, operatorInfo) {
                    marker.bindPopup(new L.Popup().setContent(
                            "<h3 class='balanced-900' style='font-family: captureit;'>" +
                            "<img src='img/ranks/PT/OR-02.png' width='20' height='38' />" +
                            "<span style='font-family: captureit;vertical-align:super;margin-left:5px;'>" + operatorName + "</span>" +
                            "</h3>" +
                            "<p style='font-family: captureit;'>" + operatorInfo + "</p>")
                    );
                };
                var addOperatorMarker = function (operator, squadId) {
                    var coordinates = new L.LatLng(operator.latitude, operator.longitude);
                    if (insidePlayableArea($scope.map, coordinates)) {
                        if (operatorsMarkers[operator.username] !== undefined) {
                            markerGroups[squadId].removeLayer(operatorsMarkers[operator.username]);
                            operatorsMarkers[operator.username].setLatLng(coordinates);
                            markerGroups[squadId].addLayer(operatorsMarkers[operator.username]);
                            $rootScope.$broadcast('operatorUpdated', operator);
                        } else {
                            var marker = new L.Marker(coordinates,
                                {
                                    id: operator.username,
                                    //icon: new L.Icon({iconUrl: 'img/skull_red.png'}),
                                    icon: new L.DivIcon({
                                        html: "<div class='pin' style='background: #219710 url(\"" + specializationPath + operator.specialization + "\") no-repeat center;background-position-y: 15px;' nickname='" + operator.nickname + "'></div>",
                                        iconSize: new L.Point(0, 0)
                                    }),
                                    title: 'Inimigo nas redondezas'
                                }
                            );
                            //marker.addTo($scope.map.map);
                            addMarkerEvents($scope.map.map, marker, operator.nickname, 'Element info');
                            if (!markerGroups[squadId]) {
                                markerGroups[squadId] = new L.MarkerClusterGroup(
                                    {
                                        iconCreateFunction: function (cluster) {
                                            //console.log($scope.map.getSquad(squadId).operatorsCount());
                                            var childCount = $scope.map.getSquad(squadId).operatorsCount();
                                            var srcicon = squadsPath +
                                                (childCount == 1 || childCount == 2 ? 'fire_maneuver' :
                                                    childCount > 2 && childCount < 6 ? 'fireteam' :
                                                        childCount > 5 && childCount < 11 ? 'patrol' :
                                                            childCount > 9 && childCount < 14 ? 'squad' :
                                                                childCount >= 14 ? 'platoon' : undefined);
                                            return new L.DivIcon({
                                                html: "<div class='pin' style='background: #219710 url(\"" + srcicon + ".png\") no-repeat bottom'></div>",
                                                iconSize: new L.Point(0, 0)
                                            });
                                        },
                                        maxClusterRadius: 100
                                    });
                                //$scope.map.map.addLayer(markerGroups[squadId]);
                                $scope.layers[squadId] = new L.LayerGroup().addTo($scope.map.map);
                                $scope.control.addOverlay($scope.layers[squadId], "Team");

                                if ($scope.mode === 'OPERATOR') {
                                    $scope.viewMode = L.control.viewmode({
                                        operator: $scope.myLocation ? $scope.myLocation.getLatLng() : undefined,
                                        squad: markerGroups[squadId]
                                    });
                                    $scope.viewMode.addTo($scope.map.map);
                                }
                                $scope.map.map.addControl(L.control.zoom({position: 'bottomleft'}));
                            }
                            markerGroups[squadId].addLayer(marker);
                            markerGroups[squadId].addTo($scope.layers[squadId]);
                            operatorsMarkers[operator.username] = marker;
                            if ($scope.viewMode !== undefined) {
                                $scope.viewMode.setSquad(markerGroups[squadId]);
                            }
                            $rootScope.$broadcast('operatorAdded', operator);
                        }
                    }
                };
                var removeOperatorMarker = function (squadId, operator) {
                    markerGroups[squadId].removeLayer(operatorsMarkers[operator.username]);
                    $scope.map.map.removeLayer(operatorsMarkers[operator.username]);
                    var operatorRemoved = operatorsMarkers[operator.username];
                    delete operatorsMarkers[operator.username];
                    $rootScope.$broadcast('operatorRemoved', operatorRemoved);
                };
                var removeHostileMarker = function (hostile) {
                    //console.log(hostileMarkers);
                    $scope.map.map.removeLayer(hostileMarkers[hostile.id]);
                    var hostileRemoved = hostileMarkers[hostile.id];
                    delete hostileMarkers[hostile.id];
                    $rootScope.$broadcast('hostileRemoved', hostileRemoved);
                    //console.log(hostileMarkers);
                    //$scope.map.removeOperator(1, $scope.map.getOperator(1, 6));
                };

                var addHostileMarker = function (hostile) {

                    var now = new Date().getTime();
                    var time = hostile.timestamp + 20000;
                    var diff = time - now;
                    //console.log('HOSTILEMARKER', now, time, diff);
                    console.log(hostile.timestamp);
                    if (diff <= 0) {
                        return;
                    }

                    var coordinates = new L.LatLng(hostile.latitude, hostile.longitude);
                    if (insidePlayableArea($scope.map, coordinates)) {
                        var icon = 'pin-hostile-direction-' + hostile.direction.identifier;
                        //console.log(hostile);
                        if (hostileMarkers[hostile.id] !== undefined) {
                            hostileMarkers[hostile.id].setLatLng(coordinates);
                            $rootScope.$broadcast('hostileUpdated', hostile);
                        } else {
                            var marker = new L.Marker(coordinates,
                                {

                                    //icon: new L.Icon({iconUrl: 'img/skull_red.png'}),
                                    icon: new L.DivIcon({
                                        html: "<div class='pin pin-hostile' nickname='" + hostile.enemiesNumber + "'>" +
                                        "<div id='" + hostile.id + "' class='pin-hostile-direction  " + icon + "'></div>" +
                                        "</div>" +
                                        "<div class='pulse'></div>",
                                        //html: "<div id='" + $scope.map.hostiles.length + "' class='pin pin-hostile " + icon + "' nickname='" + hostile.enemiesNumber + "'></div><div class='pulse'></div>",
                                        iconSize: new L.Point(0, 0)
                                    }),
                                    title: 'Inimigo nas redondezas'
                                }
                            );
                            marker.options.id = hostile.id;
                            marker.addTo($scope.map.map);
                            addMarkerEvents($scope.map.map, marker, hostile.enemiesNumber, 'Element info');
                            hostileMarkers[hostile.id] = marker;
                        }
                        if (navigator.compass) {
                            var options = {
                                frequency: 1000
                            };
                            var hostileDiv = document.getElementById(hostile.id);
                            var onSuccess = function (heading) {
                                if (hostile.direction !== Direction.CAMPER) {
                                    var magneticHeading = 360 - hostile.direction.rotation - heading.magneticHeading;
                                    var rotation = "rotate(" + magneticHeading + "deg)";
                                    hostileDiv.style.webkitTransform = rotation;
                                    hostileDiv.style.transform = rotation;
                                    hostileDiv.style.msTransform = rotation;
                                }
                            };
                            var onError = function (compassError) {
                                alert('Compass error: ' + compassError.code);
                            };
                            watchID = navigator.compass.watchHeading(onSuccess, onError, options);
                        }

                        $timeout(function () {
                            $scope.map.removeHostile(hostile);
                            if (navigator.compass) {
                                navigator.compass.clearWatch(watchID);
                            }
                        }, diff);
                        $rootScope.$broadcast('hostileAdded', hostile);


                    }
                };
                var centerOnCurrentLocation = function () {
                    if (!$scope.map) {
                        return;
                    }
                    $ionicLoading.show({
                        content: 'Getting current location...',
                        showBackdrop: false
                    });
                    var successCurrentPosition = function (pos) {
                        $scope.map.map.panTo(new L.LatLng(pos.coords.latitude, pos.coords.longitude));
                        if ($scope.mode !== "DRAW") {
                            updateLocation(pos);
                        }
                        $ionicLoading.hide();
                    };
                    var successWatchPosition = function (pos) {
                        if ($scope.mode === "DRAW") {
                            $scope.map.map.panTo(new L.LatLng(pos.coords.latitude, pos.coords.longitude));
                        } else {
                            updateLocation(pos);
                        }
                    };
                    var error = function (error) {
                        $ionicPopup.show({
                            title: "It was not possible to get your location",
                            template: error.message,
                            scope: $scope,
                            buttons: [{
                                text: "OK",
                                type: 'button-flat button-assertive'
                            }]
                        });
                    };
                    navigator.geolocation.getCurrentPosition(successCurrentPosition, error);
                    navigator.geolocation.watchPosition(successWatchPosition, error);
                };
                var createPopup = function (options, callback, latLng) {
                    if (options && options instanceof Array && options.length > 0) {
                        var option = options.shift();
                        for (var property in option.options) {
                            if (option.options.hasOwnProperty(property)) {
                                $scope[property] = option.options[property];
                            }
                        }
                        $ionicModal.fromTemplateUrl(option.templateUrl, {
                            scope: $scope,
                            animation: 'slide-in-up'
                        }).then(function (modal) {
                            callback(modal);
                            //console.log(latLng);
                            if (latLng) {
                                $scope.latLng = latLng
                            }
                        });
                    }
                };
                var drawLines = function (points, color) {
                    console.log(color);
                    var gameArea = new L.Polygon(points, {color: color}).addTo($scope.map.map);
                    $scope.control.addOverlay(gameArea, "Game Area");
                };
                var drawZone = function (zone) {
                    console.log(zone.color);
                    var zoneArea = new L.Polygon(zone.points, {color: zone.color === undefined ? 'red' : zone.color}).addTo($scope.map.map);
                    zonesMarkers[zone.id] = zoneArea;
                    $scope.control.addOverlay(zoneArea, zone.name);
                };
                var removeZone = function (zone) {
                    $scope.map.map.removeLayer(zonesMarkers[zone.id]);
                };
                var insidePlayableArea = function (map, latLng) {
                    var lat = latLng.lat, lng = latLng.lng;
                    var inside = false;
                    for (var i = 0, j = map.gameZone.points.length - 1; i < map.gameZone.points.length; j = i++) {
                        var xi = map.gameZone.points[i].lat, yi = map.gameZone.points[i].lng;
                        var xj = map.gameZone.points[j].lat, yj = map.gameZone.points[j].lng;
                        var intersect = ((yi > lng) != (yj > lng)) && (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
                        if (intersect) inside = !inside;
                    }
                    return inside;
                };
                var onEnemiesPopupSelected = function (value) {
                    $scope.enemiesNumber = value;
                    modal.hide();
                    if ($scope.enemiesNumber !== undefined) {
                        //console.log(templatePath);
                        createPopup([{
                                templateUrl: templatePath, options: {
                                    title: 'Sighted Enemies Direction',
                                    btns: [[
                                        {
                                            label: 'NW',
                                            value: Direction.NORTH_WEST,
                                            className: 'btn-direction-nw',
                                            hideLabel: true
                                        },
                                        {
                                            label: 'N',
                                            value: Direction.NORTH,
                                            className: 'btn-direction-n',
                                            hideLabel: true
                                        },
                                        {
                                            label: 'NE',
                                            value: Direction.NORTH_EAST,
                                            className: 'btn-direction-ne',
                                            hideLabel: true
                                        },
                                    ], [

                                        {
                                            label: 'W',
                                            value: Direction.WEST,
                                            className: 'btn-direction-w',
                                            hideLabel: true
                                        },

                                        {
                                            label: 'C',
                                            value: Direction.CAMPER,
                                            className: 'btn-direction-c',
                                            hideLabel: true
                                        },
                                        {
                                            label: 'E',
                                            value: Direction.EAST,
                                            className: 'btn-direction-e',
                                            hideLabel: true
                                        },
                                    ], [
                                        {
                                            label: 'SW',
                                            value: Direction.SOUTH_WEST,
                                            className: 'btn-direction-sw',
                                            hideLabel: true
                                        },
                                        {
                                            label: 'S',
                                            value: Direction.SOUTH,
                                            className: 'btn-direction-s',
                                            hideLabel: true
                                        },
                                        {
                                            label: 'SE',
                                            value: Direction.SOUTH_EAST,
                                            className: 'btn-direction-se',
                                            hideLabel: true
                                        }
                                    ], [
                                        {
                                            label: 'Cancel',
                                            className: 'btn-cancel'
                                        }
                                    ]],
                                    onclick: function (value) {
                                        if ($scope.enemiesNumber && value) {
                                            $rootScope.$broadcast('enemyDetected', {
                                                latitude: $scope.latLng.lat,
                                                longitude: $scope.latLng.lng,
                                                enemiesNumber: $scope.enemiesNumber,
                                                direction: value,
                                                timestamp: new Date().getTime(),
                                            })
                                        }
                                        modal.hide();
                                        modal.remove();
                                    },
                                    templateClass: 'directions'
                                }
                            }],
                            function (_modal) {
                                if (modal) {
                                    modal.remove();
                                }
                                (modal = _modal).show();
                            });
                    } else {
                        modal.remove();
                    }
                };
                var updateLocation = function (pos) {
                    if ($scope.myLocation) {
                        $scope.myLocation.setLatLng(new L.LatLng(pos.coords.latitude, pos.coords.longitude));
                    } else {
                        $scope.myLocation = new L.Marker(
                            new L.LatLng(pos.coords.latitude, pos.coords.longitude),
                            {
                                title: "Encontra-se aqui",
                                icon: new L.DivIcon({
                                    html: "<div class='pin pin-orange' style='background: #FF5D00 url(\"img/xpto.png\") no-repeat bottom !important' nickname='YOUR_NAME'></div>",
                                    iconSize: new L.Point(0, 0)
                                })
                            }
                        ).addTo($scope.map.map);
                        addMarkerEvents($scope.map.map, $scope.myLocation, "Encontra-se aqui1", true);
                    }
                    $rootScope.$broadcast('userPositionUpdated', {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    });
                    if ($scope.viewMode !== undefined) {
                        $scope.viewMode.setOperator($scope.myLocation.getLatLng());
                    }
                };
                //</editor-fold>

                //<editor-fold desc="DRAW">

                var generateMapControl = function () {
                    var geocoder = new google.maps.Geocoder();

                    function googleGeocoding(text, callResponse) {
                        geocoder.geocode({address: text}, callResponse);
                    }

                    function filterJSONCall(rawjson) {
                        var json = {}, key, loc, disp = [];
                        for (var i in rawjson) {
                            key = rawjson[i].formatted_address;
                            loc = L.latLng(rawjson[i].geometry.location.lat(), rawjson[i].geometry.location.lng());
                            json[key] = loc;
                        }
                        return json;
                    }

                    $scope.map.map.addControl(new L.Control.Search({
                        callData: googleGeocoding,
                        filterJSON: filterJSONCall,
                        markerLocation: false,
                        autoType: false,
                        autoCollapse: true,
                        minLength: 0,
                        maxLength: 0,
                        zoom: 17
                    }));
                };
                //</editor-fold>
                function initialize() {
                    //console.log('instantiating maps controller');
                    var mapOptions = {
                        center: new L.LatLng(43.07493, -89.381388),
                        zoom: $scope.mode === 'OPERATOR' || $scope.mode === 'COMSYS' ? 15 : 5,
                        zoomControl: false,
                        attributionControl: false,
                        maxZoom: 22,
                        minZoom: $scope.mode === 'OPERATOR' || $scope.mode === 'COMSYS' ? 8 : 0
                    };
                    $scope.map = new Map(
                        new L.Map($element[0], mapOptions),
                        drawLines,
                        addOperatorMarker,
                        removeOperatorMarker,
                        addHostileMarker,
                        removeHostileMarker,
                        drawZone,
                        removeZone);
                    var googleLayerSattelite = new L.Google('SATELLITE');
                    var googleLayerRoadMap = new L.Google('ROADMAP');
                    var googleLayerHybrid = new L.Google('HYBRID');
                    var googleLayerTerrain = new L.Google('TERRAIN');
                    $scope.layers = [];
                    $scope.control = L.control.layers({
                        "Hybrid": googleLayerHybrid,
                        "RoadMap": googleLayerRoadMap,
                        "Satellite": googleLayerSattelite,
                        "Terrain": googleLayerTerrain
                    });
                    $scope.control.setPosition('bottomright');
                    $scope.control.addTo($scope.map.map);
                    $scope.map.map.addLayer(googleLayerSattelite, {
                        maxZoom: 22,
                        minZoom: 11
                    });
                    if ($scope.mode === 'OPERATOR' || $scope.mode == 'COMSYS') {
                        var compass = L.control.compass();
                        compass.addTo($scope.map.map);
                        //console.log('map ready');
                        $scope.map.map.on('contextmenu', function (e) {
                                var latLng = new L.LatLng(e.latlng.lat, e.latlng.lng);
                                if (insidePlayableArea($scope.map, latLng)) {
                                    //scr=scr[scr.length-1]
                                    createPopup([{
                                            templateUrl: templatePath, options: {
                                                title: 'Sighted Enemies Number',
                                                btns: [[
                                                    {label: '1', value: '1'},
                                                    {label: '2', value: '2'},
                                                ], [
                                                    {label: '2-3', value: '2-3'},
                                                    {label: '3-5', value: '3-5'},
                                                ], [
                                                    {label: '5-7', value: '5-7'},
                                                    {label: '+7', value: '+7'},
                                                ], [
                                                    {label: 'Cancel', className: 'btn-direction-cancel'}
                                                ]],
                                                onclick: onEnemiesPopupSelected,
                                                templateClass: 'enemies'
                                            }
                                        }],
                                        function (_modal) {
                                            (modal = _modal).show();
                                        }, latLng);
                                }
                            }
                        );
                    } else if ($scope.mode === 'DRAW') {
                        var drawnItems = new L.FeatureGroup();
                        $scope.map.map.addLayer(drawnItems);
                        generateMapControl();
                        var generateControl = function (zoneDefined) {
                            if (zoneDefined) {
                                return new L.Control.Draw({
                                    draw: false,
                                    edit: {
                                        featureGroup: drawnItems
                                    }
                                });
                            } else {
                                return new L.Control.Draw({
                                    draw: {
                                        polygon: {
                                            shapeOptions: {
                                                color: 'orange'
                                            },
                                            allowIntersection: false,
                                            drawError: {
                                                color: 'red',
                                                timeout: 1000
                                            },
                                            showArea: true,
                                            metric: true
                                        },
                                        polyline: false,
                                        circle: false,
                                        marker: false,
                                        rectangle: {
                                            shapeOptions: {
                                                color: 'green'
                                            }
                                        }
                                    },
                                    edit: false
                                });
                            }
                        };
                        var currentControl = generateControl(false);
                        $scope.map.map.addControl(currentControl);
                        $scope.map.map.on('draw:created', function (e) {
                            drawnItems.addLayer(e.layer);
                            $scope.map.map.removeControl(currentControl);
                            currentControl = generateControl(true);
                            $scope.map.map.addControl(currentControl);
                            $rootScope.$broadcast('zoneDefined', e.layer);
                            console.log(e.layer);
                        });
                        $scope.map.map.on('draw:edited', function (e) {
                            $rootScope.$broadcast('zoneUpdated', e.layers.getLayers()[0]);
                        });
                        var deleteLayer = function (layer) {
                            var elementsNum = 0;
                            drawnItems.removeLayer(layer);
                            drawnItems.eachLayer(function (x) {
                                elementsNum++;
                            });
                            if (elementsNum == 0) {
                                $scope.map.map.removeControl(currentControl);
                                currentControl = generateControl(false);
                                $scope.map.map.addControl(currentControl);
                            }
                        };
                        $scope.map.map.on('draw:deletestop', function (e) {
                            deleteLayer(e.target);
                        });
                        $scope.$on('layerRemoved', function () {
                            console.log('layerRemoved');
                            drawnItems = new L.FeatureGroup();
                            $scope.map.map.addLayer(drawnItems);
                            $scope.map.map.removeControl(currentControl);
                            currentControl = generateControl(false);
                            $scope.map.map.addControl(currentControl);
                        });
                        $scope.$on('layerAdded', function (event, layer) {
                            //layer.addTo($scope.map.map);
                            drawnItems.addLayer(layer);
                            var elementsNum = 0;
                            drawnItems.eachLayer(function (x) {
                                elementsNum++;
                            });
                            $scope.map.map.removeControl(currentControl);
                            currentControl = generateControl(true);
                            $scope.map.map.addControl(currentControl);
                        });

                    }
                    //console.log('centering on position');
                    $scope.onCreate({map: $scope.map});
                    centerOnCurrentLocation();
                }

                if (typeof cordova !== 'undefined') {
                    document.addEventListener("deviceready", function () {
                        var so = cordova.plugins.screenorientation;
                        so.setOrientation('landscape');
                        initialize();
                    }, false);
                } else {
                    if (document.readyState === "complete" || document.readyState === "interactive") {
                        initialize();
                    }
                }
            }
        }
    }
);
