(function() {
    'use strict';

    angular.module('document', ['ngRoute', 'document.edit', 'documentService', 'vibrationService', 'priorityMenu'])
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

    function DocumentController($scope, $location, $routeParams, $mdDialog, documentService, vibrationService) {
        $scope.document = {};
        $scope.metadata = {};

        documentService.getDocument($routeParams.id).then(function(document) {
            $scope.document = document.document;
            $scope.metadata = document.metadata;
        });

        $scope.back = function() {

            vibrationService.vibrate(20);

            if (typeof $scope.metadata.parentId === 'undefined') {
                //parent is root
                $location.path('/').replace();
            } else {
                //parent is group
                $location.path('/group/' + $scope.metadata.parentId).replace();
            }
        };

        $scope.delete = function(e) {
            var documentName = '';
            if ($scope.document.name.length > 0) {
                documentName = ' "' + $scope.document.name + '" ';
            }

            var confirm = $mdDialog.confirm()
                .title('Delete the document' + documentName + '?')
                .content('This action can\'t be undone.')
                .ok('Yes, delete')
                .cancel('No');

            if (typeof e !== 'undefined') {
                confirm.targetEvent(e);
            }

            $mdDialog.show(confirm).then(function() {
                documentService.removeDocument($scope.document.id);
                $scope.back();
            });
        };

        $scope.edit = function() {
            $location.path('/document/' + $scope.document.id + '/edit').replace();
        };

        $scope.setPriority = function(priority) {
            $scope.document.priority = priority;
            documentService.updateDocument($scope.document);
        };
    }
}());
