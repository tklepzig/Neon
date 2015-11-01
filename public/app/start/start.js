(function() {
    'use strict';

    angular.module('start', ['ngRoute'])
        .config(defineRoutes)
        .controller('StartController', StartController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/start/start.html',
            controller: 'StartController'
        });
    }

    function StartController($scope, $localStorage, $window) {

        $scope.switchTheme = function() {
            if ($localStorage.theme === 'dark') {
                delete $localStorage.theme;
            } else {
                $localStorage.theme = 'dark';
            }

            $window.location.reload();
        };
    }
}());
