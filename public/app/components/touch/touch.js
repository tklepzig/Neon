(function() {
    'use strict';

    var NG_HIDE_CLASS = 'ng-hide';
    var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';

    angular.module('neon.touch', [])
        .factory('touchService', touchService)
        .directive('ngShowTouch', ngShowTouch)
        .directive('ngHideTouch', ngHideTouch);


    function touchService($window) {
        var module = {};

        module.isSupported = function() {
            return 'ontouchstart' in $window || !!($window.navigator.msMaxTouchPoints);
        };

        return module;
    }


    //source taken from original ngShow/ngHide implementation
    //see https://github.com/angular/angular.js/blob/master/src/ng/directive/ngShowHide.js
    function ngShowTouch($animate, touchService) {
        return {
            restrict: 'A',
            multiElement: true,
            link: function(scope, element) {
                // we're adding a temporary, animation-specific class for ng-hide since this way
                // we can control when the element is actually displayed on screen without having
                // to have a global/greedy CSS selector that breaks when other animations are run.
                // Read: https://github.com/angular/angular.js/issues/9103#issuecomment-58335845
                $animate[touchService.isSupported() ? 'removeClass' : 'addClass'](element, NG_HIDE_CLASS, {
                    tempClasses: NG_HIDE_IN_PROGRESS_CLASS
                });
            }
        };
    }

    function ngHideTouch($animate, touchService) {
        return {
            restrict: 'A',
            multiElement: true,
            link: function(scope, element) {
                // The comment inside of the ngShowTouch explains why we add and
                // remove a temporary class for the show/hide animation
                $animate[touchService.isSupported() ? 'addClass' : 'removeClass'](element, NG_HIDE_CLASS, {
                    tempClasses: NG_HIDE_IN_PROGRESS_CLASS
                });
            }
        };
    }
}());
