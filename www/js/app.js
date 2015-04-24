// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var HMApp = angular.module('hmApp', ['ionic']);

HMApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

HMApp.controller('hmCtrl', function($scope, $http) {
  $scope.systems = [ ];
  $scope.mainLabel = "select....";
  $scope.currentSystem = {};

  $scope.getSystemsUrl = "https://hmalpa-netrc.c9.io/rest/system/";

  $scope.getSystems = function hmCtrl_getSystems() {
    return $http.get("https://hmalpa-netrc.c9.io/rest/system/").success(function(data) {
     var tmp = [];
     data.map(function(s){ tmp.push( {name: s} ) });
     $scope.systems = tmp;
    }).error(function(data) {
      console.log("systems error: " + data.status);
    });
  };

  $scope.createNewLog = function hmCtrl_createNewLog() {
    console.log("create new log:" + $scope.currentSystem.name);
    // add, model / post
  };
	// and see http://jsfiddle.net/UhUP5/1/ for how to do multi-templates in-line sort of
  $scope.showSystem = function hmCtrl_showSystem( s ) {
    console.log("show system:" + s);
    $scope.mainLabel = s.name;
    $scope.currentSystem = s;
    // get s
    //
    return $http.get("https://hmalpa-netrc.c9.io/rest/system/"+s.name).success(function(data) {
     console.log("ss ok, #rows: " + data.length);
     console.log("ss ok, 0 location: " + data[0].location + " vendor: " + data[0].vendor);
     $scope.currentSystem.vendormodel = data[0].vendormodel;
     $scope.currentSystem.location = data[0].location;
    }).error(function(data) {
      console.log("systems error: " + data.status);
    });
  };

  $scope.reorderSystems = function hmCtrl_reorderSystems(s, fromIndex, toIndex) {
    if (fromIndex == toIndex) { return; }
    //console.log("from: " + fromIndex + "  to: " + toIndex + " ... " + s.name );
    $scope.systems.splice(fromIndex-1,1); // remove s
    $scope.systems.splice(toIndex,0, s);
  };

  // "main" section for this controller
  $scope.getSystems();

  // for accordion house/system
  // http://codepen.io/ionic/pen/uJkCz?editors=101
});
