(function() {
    'use strict';

    angular.module('document', ['ngRoute', 'document.edit', 'documentService', 'priorityMenu', 'moveItemMenu'])
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

    function DocumentController($scope, $location, $routeParams, $mdDialog, documentService) {
        $scope.ready = false;
        $scope.document = {};
        $scope.metadata = {};

        $('pagedown-viewer').on('click', 'a', function() {
            $(this).attr('target', '_blank');
        });

        documentService.getDocument($routeParams.id).then(function(document) {
            $scope.document = document.document;
            $scope.metadata = document.metadata;
            $scope.ready = true;
        });

        $scope.back = function() {
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

        $scope.moveToGroup = function(groupId) {
            documentService.moveDocument($scope.document.id, $scope.metadata.parentId, groupId).then(function() {
                if (typeof groupId === 'undefined') {
                    $location.path('/').replace();
                } else {
                    $location.path('/group/' + groupId).replace();
                }
            });
        };
    }
}());
