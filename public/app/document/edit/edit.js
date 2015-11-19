(function() {
    'use strict';

    angular.module('document.edit', ['ngRoute', 'documentService'])
        .config(defineRoutes)
        .controller('EditController', EditController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/document/:id/edit', {
            templateUrl: 'app/document/edit/edit.html',
            controller: 'EditController'
        });
    }

    function EditController($scope, $location, $routeParams, documentService) {
        $scope.document = documentService.getDocument($routeParams.id);
        $scope.done = function() {
            $location.path('/document/' + $scope.document.id);
        };

    }
}());
