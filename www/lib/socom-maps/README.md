# SOCOM MAPS

Directive that allows the manipulation of a google maps and leaflet based map.
This entity is intended to be used on a AirSoft project.

![logo]

[logo]: https://raw.githubusercontent.com/oliveira0011/socom-maps/master/map.png "Socom Map"

##Installation
In order to use this directive the easiest way is to use bower.

	bower install socom-maps

Another way is obtaining the source code of the directive and put it on one of the projects folder.
There is also available a running example on the folder minimal_example on which there are represented a game area and a squad of three players, including the user using the app. 

In order to see the functionality of the directive on a mobile device, the following commands are needed.

###Platforms:
	
	ionic add platform android
	ionic add platform ios
###Plugins (all mandatory)
	
	ionic plugin add net.yoik.cordova.plugins.screenorientation
	ionic plugin add cordova-plugin-whitelist
	ionic plugin add cordova-plugin-geolocation
	ionic plugin add cordova-plugin-device-orientation

###After obtaining the source code
After obtaining the source code, all the libraries on wich the directive depends on will be available.
The next step is to indicate the needed files on the .html pages.
Assuming that the installation files became available on a lib folder, the correct links and scripts are:
	
		<-- IONIC CSS --!>
	    <link rel="stylesheet" href="lib/ionic/css/ionic.min.css" type="text/css"><link>
	    <-- LEAFLET CSS --!>
    	<link href="lib/leaflet/dist/leaflet.css" rel="stylesheet"/>
    	<link href="lib/leaflet.markercluster/dist/MarkerCluster.Default.css" rel="stylesheet"/>
    	<-- SOCOM CSS --!>
	    <link href="lib/socom-maps/socom-maps.css" rel="stylesheet"/>
    	<link href="lib/socom-maps.compass/socom-compass.css" rel="stylesheet"/>
    	<link href="lib/socom-maps.view-mode/socom-maps-viewmode.css" rel="stylesheet"/>
    	<!-- IONIC-->
    	<script src="lib/ionic/js/ionic.bundle.js" type="text/javascript"></script>
    	<!-- GOOGLE MAPS IMPORT-->
    	<script src="https://maps.googleapis.com/maps/api/js" type="text/javascript"></script>
    	<!-- LEAFLET IMPORTS-->
    	<script src="lib/leaflet/dist/leaflet.js" type="text/javascript"></script>
    	<script src="lib/leaflet.markercluster/dist/leaflet.markercluster.js" type="text/javascript"></script>
    	<!-- SOCOM IMPORTS-->
    	<script src="lib/socom-maps/socom-maps.js" type="text/javascript"></script>
    	<script src="lib/socom-maps/leaflet-google.js" type="text/javascript"></script>
    	<script src="lib/socom-maps.compass/socom-compass.js" type="text/javascript"></script>
    	<script src="lib/socom-maps.view-mode/socom-maps-viewmode.js" type="text/javascript"></script>
    	<script src="lib/socom-maps/socom-maps.js" type="text/javascript"></script>

###Seeing the map
After all the links and scripts are specified on the .html pages, the only thing needed is indicate the tag map on the pages

	<map on-create="map-created(map)"></map>

and creating a controller so that we can manipulate the map object

    angular.module('xpto', ['ionic', 'socom-maps']).controller('xptoController', function ($scope, Squad, Operator, Specialization) {
        $scope.mapCreated = function (map) {
            $scope.map = map;
            $scope.map.addSquad(new Squad(1));
            $scope.map.setPlayableArea([
                new L.LatLng(39.749603, -8.81188),
                new L.LatLng(39.747245, -8.809389),
                new L.LatLng(39.7350782, -8.8159208),
                new L.LatLng(39.7250685, -8.7888804),
                new L.LatLng(39.7042049, -8.7450639),
                new L.LatLng(39.7049312, -8.7117615),
                new L.LatLng(39.7470229, -8.6982563),
                new L.LatLng(39.763266, -8.7687178),
                new L.LatLng(39.749603, -8.81188)
            ]);
        	$scope.map.addOperator(1, new Operator(1, 1, 39.73669629664551, -8.727478981018065, Specialization.TRANSPORTATION));
        	$scope.map.addOperator(1, new Operator(1, 12, 39.74669629664551, -8.727478981018065, Specialization.MEDIC));
    	}
	});

###More details

As already refered there is a minimal_example project running that can be used for tests and understanding the previous explanation in a more contextualized way.

##Entities

Several objects can be manipulated and represented on the map:
 - Map;
 - PlayableArea;
 - Operator;
 - Specialization;
 - Squad;
 - Hostile;
 - Direction;
 - EnemiesNumber; 

### Map

The map object is the core of the entity. When using the directive, a map will be instantiated and will become available to whoever needs to manipulate it. The binding of the map object can be done by specifying a method on the on-create property of the directive that will receive this map.

    <map on-create="map-created(map)"></map>

The map has several methods available:

| Method  			| Parameters			| Description
|:--:|:--|:--|
| addHostile | hostile			  			| Receives an hostile object and represents it on the map. The hostile will be represented on the point of the map that corresponds to the coordinates associated to the hostile.|
| removeHostile 	| hostile			  	| Receives an hostile object and removes it from the map. |
| getHostile		| hostileId				| Returns the hostile with the given hostileId or nothing if it doesn't find any.|
| addSquad			| squad				  	| Receives a squad object and adds it to the list of squads present on the map.|
| removeSquad		| squad				  	| Receives a squad object and removes it from the list of squads present on the map.|
| getSquad			| squadId				| Returns the squad with the given squadId or nothing if it doesn't find any.|
| setPlayableArea 	| playableareapoints 	| Sets the area of the game. The area will be represented by the order of the points received. The points are L.LatLng objects from leaflet.js and receive a latitude and longitude. |
| addOperator		| squadId			  	| Receives a squadId and an operator and adds the operator to the squad whose id is the same as squadId. |
| 					| operator		  		||
| removeOperator	| operator		  		| Receives a squadId and an operator and removes the operator from the squad whose id is the same as squadId. |
| 					| squadId		  		||

### Playable Area

Represents the area of the game. The notification of hostiles detected can only be performed within the bounds of this area. If the area is not set, the user cannot notify the presence of any hostile.
This object only contains an array f L.LatLng objects that are used to represent the points of the game area.

### Operator

Represents a squad player. An operator is represented by an username, a nickname, a latitude, a longitude and a specialization. The specialization must be a Specialization object option;

### Specialization

Represents all the squad player possible values for it's specialization. This values are:

|Specialization|
|:--:|
|INFANTRY|
|MEDIC|
|MAINTENANCE|
|RECON|
|SIGNALS|
|SOF|
|ENGINEER|
|RADAR|
|TRANSPORTATION|
|ARMOUR|
|ANTI_TANK|
|MORTAR|
|GUNNER|
|LOADER|
|ARTELLERY|
|BRIDGING|
|NO_SPEC|


### Squad

Represents a squad composed by operators. This objects supports the addition and removal of operators.

### Hostile

Represents an hostile. An hostile is represented by a latitude, a longitude, a EnemiesNumber option and a Direction option;

### EnemiesNumber

Represents the possible seen number of hostile seen. The possible values are:

|EnemiesNumber|
|:--:|
|ONE|
|TWO|
|THREE_FIVE|
|FIVE_SEVEN|
|PLUS_SEVEN|

### Direction

Represents the possible direction of a seen hostile. The possible values are:

|Direction|
|:--:|
|NORTH_EAST|
|NORTH|
|NORTH_WEST|
|EAST|
|CAMPER|
|WEST|
|SOUTH_EAST|
|SOUTH|
|SOUTH_WEST|

