(function() {
    'use strict';

    angular.module('document.edit', ['ngRoute', 'documentService'])
        .config(defineRoutes)
        .controller('EditController', EditController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/document/:id/edit', {
            templateUrl: 'app/document/edit/edit.html',
            controller: 'EditController'//,
            // hotkeys: [
            //     ['ctrl+enter', 'Done', 'done()'],
            //     ['esc', 'Done', 'done()']
            // ]
        });
    }

    function EditController($scope, $location, $routeParams, documentService) {
        documentService.getDocument($routeParams.id).then(function(document) {
            $scope.document = document;
        });

        $scope.done = function() {
            $location.path('/document/' + $scope.document.id);
        };

    }
}());
