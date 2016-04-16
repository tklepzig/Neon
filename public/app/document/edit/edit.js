(function() {
    'use strict';

    angular.module('document.edit', ['ngRoute', 'documentService', 'setFocus', 'ngAllowTab'])
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
        $scope.focusName = false;
        $scope.focusText = false;

        documentService.getDocument($routeParams.id).then(function(document) {
            $scope.document = document.document;
            $scope.metadata = document.metadata;
            $scope.focusText = true;
        });

        $scope.textKeyDown = function(e) {
            //F2 or up arrow at position 0
            if (e.keyCode === 113 || (e.keyCode === 38 && e.originalEvent.path.length > 0 && e.originalEvent.path[0].selectionStart === e.originalEvent.path[0].selectionEnd && e.originalEvent.path[0].selectionStart === 0)) {
                $scope.focusName = true;
                $scope.focusText = false;
            }
        };

        $scope.nameKeyDown = function(e) {
            //escape, down arrow or enter
            if (e.keyCode === 27 || e.keyCode === 40 || e.keyCode === 13) {
                $scope.focusName = false;
                $scope.focusText = true;
                e.preventDefault();
                e.stopPropagation();
            }
        };

        $scope.update = function() {
            documentService.updateDocument($scope.document);
        };

        $scope.done = function() {
            if ($scope.document.name.length === 0 && $scope.document.text.length === 0) {
                documentService.removeDocument($scope.document.id);
                if (typeof $scope.metadata.parentId === 'undefined') {
                    //parent is root
                    $location.path('/').replace();
                } else {
                    //parent is group
                    $location.path('/group/' + $scope.metadata.parentId).replace();
                }
            } else {
                $location.path('/document/' + $scope.document.id).replace();
            }
        };
    }
}());
