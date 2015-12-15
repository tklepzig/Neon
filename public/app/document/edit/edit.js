(function() {
    'use strict';

    angular.module('document.edit', ['ngRoute', 'documentService', 'setFocus'])
        .config(defineRoutes)
        .controller('EditController', EditController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/document/:id/edit', {
            templateUrl: 'app/document/edit/edit.html',
            controller: 'EditController' //,
                // hotkeys: [
                //     ['ctrl+enter', 'Done', 'done()'],
                //     ['esc', 'Done', 'done()']
                // ]
        });
    }

    function EditController($scope, $location, $routeParams, documentService) {

        $scope.unsetDocumentName = 'Unnamed';
        $scope.focusDocument = false;

        documentService.getDocument($routeParams.id).then(function(document) {
            $scope.document = document;
            $scope.focusDocument = true;
        });

        $scope.updateDocument = function() {
            documentService.updateDocument($scope.document);
        };

        $scope.updateName = function(document, name) {
            document.name = name;
            documentService.updateDocument(document);
        };

        $scope.done = function() {
            $location.path('/document/' + $scope.document.id);
        };
    }
}());
