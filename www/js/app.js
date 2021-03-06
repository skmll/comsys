//Ionic Starter App

//angular.module is a global place for creating, registering and retrieving Angular modules
//'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
//the 2nd parameter is an array of 'requires'
//'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'firebase', 'socom-maps']);

app.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			// StatusBar.styleDefault();
			StatusBar.style(2);
		}
	});
});

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider

	.state('app', {
		url: "/app",
		abstract: true,
		templateUrl: "templates/menu.html",
		controller: 'MenuCtrl'
	})

	.state('app.map', {
		url: "/map",
		views: {
			'menuContent': {
				templateUrl: "templates/map.html",
				controller: 'MapCtrl'
			}
		}
	})

	.state('app.squadManag', {
		url: "/squadManag",
		views: {
			'menuContent': {
				templateUrl: "templates/comsys/squadManagement.html",
				controller: 'SquadManagCtrl'
			}
		}
	})

	.state('app.tacticalActions', {
		url: "/tacticalActions",
		views: {
			'menuContent': {
				templateUrl: "templates/comsys/tacticalActions.html",
				controller: 'TacticalActionsCtrl'
			}
		}
	})

	.state('app.settings', {
		url: "/settings",
		views: {
			'menuContent': {
				templateUrl: "templates/settings.html",
				controller: 'SettingsCtrl'
			}
		}
	})

	.state('app.seeEvents', {
		cache: false,
		url: "/seeEvents",
		views: {
			'menuContent': {
				templateUrl: "templates/comsys/seeEvents.html",
				controller: 'SeeEventsCtrl'
			}
		}
	})

	.state('app.eventDetails', {
		url: "/eventDetails",
		views: {
			'menuContent': {
				templateUrl: "templates/comsys/eventDetails.html",
				controller: 'EventDetailsCtrl'
			}
		}
	})

	.state('app.profile', {
		url: "/profile",
		views: {
			'menuContent': {
				templateUrl: "templates/comsys/profile.html",
				controller: 'ProfileCtrl'
			}
		}
	})

	.state('systemhack', {
		url: "/systemhack",
		templateUrl: 'templates/systemHack.html',
		controller: 'systemHackCtrl'
	});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/map');
});
