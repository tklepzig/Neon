(function() {
    'use strict';

    angular.module('vibrationService', [])
        .factory('vibrationService', vibrationService);

    function vibrationService($window) {
        var module = {};

        module.vibrate = function(duration) {
            $window.navigator.vibrate = $window.navigator.vibrate || $window.navigator.webkitVibrate || $window.navigator.mozVibrate || $window.navigator.msVibrate;

            if ($window.navigator.vibrate) {
                $window.navigator.vibrate(duration);
            }
        };

        return module;
    }
}());
