(function() {
    'use strict';

    angular.module('document.edit', ['ngRoute', 'documentService', 'setFocus', 'ngAllowTab', 'ngEnter'])
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
        $scope.focusDocument = false;

        documentService.getDocument($routeParams.id).then(function(document) {
            $scope.document = document;
            $scope.focusDocument = true;
        });

        $scope.update = function() {
            documentService.updateDocument($scope.document);
        };

        $scope.done = function() {
            if ($scope.document.name.length === 0 && $scope.document.text.length === 0) {
                documentService.removeDocument($scope.document.id);
                $location.path('/');
            } else {
                $location.path('/document/' + $scope.document.id);
            }
        };
    }
}());
