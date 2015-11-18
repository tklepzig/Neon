(function() {
    'use strict';

    angular.module('document', ['ngRoute', 'documentService'])
        .config(defineRoutes)
        .controller('DocumentController', DocumentController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/document/:id', {
            templateUrl: 'app/document/document.html',
            controller: 'DocumentController'
        });
    }

    function DocumentController($scope, $location, $routeParams, documentService) {
        $scope.document = documentService.getDocument($routeParams.id);

        $scope.back = function() {
            $location.path('/');
        };
    }
}());
