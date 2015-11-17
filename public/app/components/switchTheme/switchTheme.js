(function() {
    'use strict';

    angular.module('switchTheme', []).
    directive('switchTheme', switchTheme);

    function switchTheme($window, $localStorage) {

        var iconName = $localStorage.theme === 'dark' ? 'wb_sunny' : 'brightness_2';

        return {
            restrict: 'E',
            template: '<md-button class="md-icon-button" ng-click="st()"><md-icon md-font-set="material-icons">' + iconName + '</md-icon></md-button>',
            link: function(scope, element) {

                scope.st = function() {
                    if ($localStorage.theme === 'dark') {
                        delete $localStorage.theme;
                    } else {
                        $localStorage.theme = 'dark';
                    }

                    // console.dir(element.find('md-icon').text());

                    $window.location.reload();
                };

            }
        };
    }
}());
