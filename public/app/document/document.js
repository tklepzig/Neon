(function() {
    'use strict';

    angular.module('document', ['ngRoute', 'document.edit', 'documentService', 'groupService', 'vibrationService', 'itemOptions'])
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

    function DocumentController($scope, $rootScope, $location, $routeParams, $mdToast, documentService, groupService, vibrationService) {
        $scope.ready = false;
        $scope.document = {};
        $scope.metadata = {};
        $scope.moveToGroupList = [];

        $(document).on('click', 'pagedown-viewer a', function() {
            $(this).attr('target', '_blank');
        });

        documentService.getDocument($routeParams.id).then(function(document) {
            $scope.document = document.document;
            $scope.metadata = document.metadata;

            groupService.getMoveToGroupList($scope.document).then(function(groups) {
                $scope.moveToGroupList = groups;
                $scope.ready = true;
            });
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

        $scope.delete = function() {
            var documentName = $rootScope.getItemName($scope.document);
            if (documentName.length > 0) {
                documentName = ' "' + documentName + '"';
            }

            documentService.removeDocument($scope.document.id);
            $scope.back();

            $mdToast.show($mdToast
                .simple()
                .hideDelay(10000)
                .textContent('Document' + documentName + ' deleted')
                .theme('info-toast')
            );
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
