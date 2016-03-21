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
        $scope.focusText = false;
        $scope.focusName = false;

        documentService.getDocument($routeParams.id).then(function(document) {
            $scope.document = document;
            $scope.focusText = true;
        });

        $scope.textKeyDown = function(e) {
            //F2 or up arrow at position 0
            if (e.keyCode === 113 || (e.keyCode === 38 && e.path.length > 0 && e.path[0].selectionStart === e.path[0].selectionEnd && e.path[0].selectionStart === 0)) {
                $scope.focusText = false;
                $scope.focusName = true;
            }
        };

        $scope.nameKeyDown = function(e) {
            //down arrow or enter
            if (e.keyCode === 40 || e.keyCode === 13) {
                $scope.focusText = true;
                $scope.focusName = false;
            }
        };

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
