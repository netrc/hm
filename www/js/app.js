
var backandAnonToken="eadd7920-0812-4eaf-a5d8-974b5f5f919c";
// Use an Angular HTTP Interceptor to add the anonymous token to each HTTP request
function anonHttpInterceptor($q, $log) {
      return {
        request: function(config) {
          config.headers['AnonymousToken'] = backandAnonToken;
          return config;
        }
      };
    }

function httpInterceptor($q, $log, $cookieStore) {
   return {
    request: function(config) {
      config.headers['Authorization'] = $cookieStore.get('backand_token');
      return config;
    }
  };
}

var HMApp = angular.module('hmApp', ['ionic', 'backand', 'ngCookies']);

//HMApp.config(['$httpProvider', function ($httpProvider) {
//  $httpProvider.interceptors.push(httpInterceptor);
//}]);

HMApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, BackandProvider) {
  $httpProvider.interceptors.push(httpInterceptor);
  BackandProvider.manageDefaultHeaders();
});


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

HMApp.controller('hmCtrl', function($scope, $http, $ionicModal, Backand) {
  // see bottom of func for 'main'

//c9  $scope.getSystemsUrl = "https://hmalpa-netrc.c9.io/rest/system/";
//c9    return $http.get("https://hmalpa-netrc.c9.io/rest/system/").success(function(data) {

  $scope.getSystems = function hmCtrl_getSystems() {
    return $http.get("https://api.backand.com:443/1/objects/system").success(function(data) {
     var tmp = data.data;
     $scope.systems = tmp;
    }).error(function(data) {
      console.log("systems error: " + data.status);
    });
  };

  $scope.createNewLog = function hmCtrl_createNewLog() {
    console.log("create new log:" + $scope.currentSystem.name);
    delete $http.defaults.headers.common["X-Requested-With"];
    var postdata = "title='a new title'";
    var postdata = {title:'a new title', displaydate:'4/24/2015', author:1, note:'long new note', systemid:1};
//    var config = {
//            method: 'POST',
//            url: 'https://hmalpa-netrc.c9.io/rest/log/',
//            headers: {
//              'Content-Type': undefined,
              //'Content-Type': 'application/json',
//              'Content-Type': 'text/plain',
//              'X-Requested-With': undefined
//           },
//           data: postdata
//       };
    return $http.post('https://hmalpa-netrc.c9.io/rest/log/', postdata ).
//    return $http(config).
  success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
    console.log("log post ok:" + status);
  }).
  error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    console.log("log post error:" + status);
  });
  };
	// and see http://jsfiddle.net/UhUP5/1/ for how to do multi-templates in-line sort of
  $scope.showSystem = function hmCtrl_showSystem( s ) {
    $scope.mainLabel = s.name;
    $scope.currentSystem = s; // just using the name/id fields // now get the rest
    return $http.get("https://api.backand.com:443/1/objects/system/"+s.id).success(function(data) {
     //console.log("ss ok, location: " + data.location + " vendor: " + data.vendor);
     $scope.currentSystem.vendormodel = data.vendor;
     $scope.currentSystem.location = data.location;
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

  // a little piece of init
    $ionicModal.fromTemplateUrl('newSystemModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal
    });
    $scope.doNewSystemModal = function() {
var z = Backand.getUsername();
      $scope.modal.show()
    }

    $scope.saveNewSystemModal = function() {
      // why is the $scope in 'this' and not in $scope
      console.log("saveNewSystemModal: " + this.newSystem.name + " - " + this.newSystem.location + " - " + this.newSystem.vendor );
      var newS = {
	       "name": this.newSystem.name,
	        "location": this.newSystem.location,
	         "vendor": this.newSystem.vendor,
	          "house": 1
          };
      //return $http.post('https://hmalpa-netrc.c9.io/rest/log/', postdata ).
      return $http.post("https://api.backand.com:443/1/objects/system", newS).success(function(data) {
        //console.log("newS ok, location: " + data.location + " vendor: " + data.vendor);
        //$scope.currentSystem.vendormodel = data.vendor;
        //$scope.currentSystem.location = data.location;
      }).error(function(data) {
        console.log("systems error: " + data.status);
      });
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });


  // "main" section for this controller
  $scope.systems = [ ];
  $scope.mainLabel = "select....";
  $scope.currentSystem = {};
  var x = Backand.getSocialProviders();
  var xg = x.google;
  Backand.setAppName('hm1');
  Backand.socialSignIn('google', '/').then(
      function(response) {
        console.log("social g signin success; loading user details");
        var a = Backand.getUserDetails().then( function(response) {
          console.log("got user details");
        },
        function(response){
          console.log("user details error");
        });
        var b = Backand.getUserRole();
        var c = Backand.getUsername();
        $scope.getSystems();
        return (response);
      },
      function(error) {
        console.log("signin error");
        console.log("error:" + error);
        return(error);
      }
  );




  // for accordion house/system
  // http://codepen.io/ionic/pen/uJkCz?editors=101
});
