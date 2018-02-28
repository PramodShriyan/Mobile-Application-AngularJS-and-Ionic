// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var db = {};
var isOnline;
var macaddress;
var deviceNameFull;
var userDetails;

angular.module('app', ['ngCordova', 'ionic', 'app.controllers', 'app.routes', 'app.directives', 'app.services', 'ionic-datepicker'])

.config(function ($ionicConfigProvider, $sceDelegateProvider) {


    $sceDelegateProvider.resourceUrlWhitelist(['self', '*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

})


.run(function ($rootScope, $ionicPlatform, $cordovaVibration, $cordovaSQLite, $cordovaNetwork, $cordovaPinDialog, $cordovaDevice, $filter) {
    $ionicPlatform.ready(function () {





        var deviceName = cordova.plugins.deviceName;
        deviceNameFull = deviceName.name;


        window.MacAddress.getMacAddress(function (macAddress) {
            macaddress = macAddress;

        }, function (fail) {
            alert(fail);
        });



        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {

            StatusBar.styleDefault();
        }

        isOnline = $cordovaNetwork.isOnline()

        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {

            isOnline = $cordovaNetwork.isOnline()

        })

        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
            isOnline = $cordovaNetwork.isOnline()

        })

        try {
            db = $cordovaSQLite.openDB({ name: "TPMTrakSQLite.db", location: 'default'});
            //db = window.sqlitePlugin.openDatabase({ name: "TPMTrakSQLite.db", location: 'default' });

            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS DayData (Date text primary key, jsonData text, lastRefreshed text)");

            var tody = new Date();
            //var minDt = new Date(tody.setDate(tody.getDate() - 60));

            var minDt = $filter('date')(new Date(tody.setDate(tody.getDate() - 60)), 'yyyy-MM-dd');

            // alert("mindate: "+minDt);
            //for (var i = 1; i <= 60; i++) {
            var qry = "DELETE FROM DayData Where Date?";
            $cordovaSQLite.execute(db, qry, [minDt]).then(function (res) {

            }, function (err) {
                //alert(err);
            });

            // }


        } catch (error) {
            alert('Open database ERROR : ' + JSON.stringify(error));
        }






    });

})

/*
  This directive is used to disable the "drag to open" functionality of the Side-Menu
  when you are dragging a Slider component.
*/
.directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function ($ionicSideMenuDelegate, $rootScope) {
    return {
        restrict: "A",
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            function stopDrag() {
                $ionicSideMenuDelegate.canDragContent(false);
            }

            function allowDrag() {
                $ionicSideMenuDelegate.canDragContent(true);
            }

            $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
            $element.on('touchstart', stopDrag);
            $element.on('touchend', allowDrag);
            $element.on('mousedown', stopDrag);
            $element.on('mouseup', allowDrag);

        }]
    };
}])

/*
  This directive is used to open regular and dynamic href links inside of inappbrowser.
*/
.directive('hrefInappbrowser', function () {
    return {
        restrict: 'A',
        replace: false,
        transclude: false,
        link: function (scope, element, attrs) {
            var place = attrs['hrefInappbrowser'] || '_system';
            element.bind('click', function (event) {

                var href = event.currentTarget.href;

                window.open(href, place, 'location=yes');

                event.preventDefault();
                event.stopPropagation();

            });
        }
    };
});