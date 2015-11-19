(function() {
    'use strict';

    angular.module('switchTheme', []).
    directive('switchTheme', switchTheme);

    function switchTheme($rootScope, $localStorage) {

        var iconName = $rootScope.currentTheme === 'default-dark' ? 'wb_sunny' : 'brightness_2';

        return {
            restrict: 'E',
            template: '<md-button class="md-icon-button" ng-click="switchTheme()"><md-icon md-font-set="material-icons">' + iconName + '</md-icon></md-button>',
            link: function(scope, element) {

                scope.switchTheme = function() {
                    $rootScope.currentTheme = $rootScope.currentTheme === 'default' ? 'default-dark' : 'default';
                    $localStorage.theme = $rootScope.currentTheme;
                    element.find('md-icon').text($rootScope.currentTheme === 'default-dark' ? 'wb_sunny' : 'brightness_2');
                };

            }
        };
    }
}());
