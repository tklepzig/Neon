(function() {
    'use strict';

    angular.module('document', ['ngRoute', 'document.edit', 'documentService'])
        .config(defineRoutes)
        .controller('DocumentController', DocumentController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/document/:id', {
            templateUrl: 'app/document/document.html',
            controller: 'DocumentController' //,
                // hotkeys: [
                //     ['e', 'Edit', 'edit()'],
                //     ['esc', 'Back', 'back()']
                // ]
        });
    }

    function DocumentController($scope, $location, $routeParams, documentService) {
        documentService.getDocument($routeParams.id).then(function(document) {
            $scope.document = document;
        });

        $scope.back = function() {
            $location.path('/');
        };

        $scope.edit = function() {
            $location.path('/document/' + $scope.document.id + '/edit');
        };
    }
}());
