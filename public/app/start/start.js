(function() {
    'use strict';

    angular.module('start', ['ngRoute', 'documentService', 'document'])
        .config(defineRoutes)
        .controller('StartController', StartController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/start/start.html',
            controller: 'StartController'
        });
    }

    function StartController($scope, $localStorage, $window, $location, documentService) {
        $scope.documents = documentService.getAllDocuments();
        $scope.openDocument = function(document) {
            $location.path('/document/' + document.id);
        };
    }
}());
