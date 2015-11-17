(function() {
    'use strict';

    angular.module('document.show', ['ngRoute', 'documentService'])
        .config(defineRoutes)
        .controller('ShowController', ShowController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/document/:id', {
            templateUrl: 'app/document/show/show.html',
            controller: 'ShowController'
        });
    }

    function ShowController($scope, $routeParams, $location, documentService) {
        $scope.document = documentService.getDocument($routeParams.id);

        $scope.back = function() {
            $location.path('/');
        };
    }
}());
