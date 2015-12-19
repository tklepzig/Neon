(function() {
    'use strict';

    angular.module('touchService', [])
        .factory('touchService', touchService);

    function touchService($window) {
        var module = {};

        module.isSupported = function() {
            return 'ontouchstart' in $window || !!($window.navigator.msMaxTouchPoints);
        };

        return module;
    }
}());
