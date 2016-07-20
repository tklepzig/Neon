(function() {
    'use strict';

    angular.module('trash', ['documentService', 'itemsView'])
        .config(defineRoutes)
        .controller('Trash', Trash);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/trash', {
            templateUrl: 'app/trash/trash.html',
            controller: 'Trash'
        });
    }

    function Trash($scope, $location, $mdDialog, documentService, groupService, vibrationService) {
        $scope.ready = false;
        $scope.deletedItems = {};
        $scope.view = 'grid';

        documentService.getDeletedItems().then(function(items) {
            $scope.deletedItems = items;
            $scope.ready = true;
        });

        $scope.back = function() {
            vibrationService.vibrate(20);
            $location.path('/').replace();
        };

        $scope.showPopup = function(item, e) {
            $mdDialog.show({
                controller: Dialog,
                templateUrl: 'app/trash/dialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: e,
                clickOutsideToClose: true
            }).then(function(action) {
                if (action === 'restore') {
                    if (item.type === 'document') {
                        documentService.restoreDocument(item.id);
                    } else if (item.type === 'group') {
                        groupService.restoreGroup(item.id);
                    }
                } else if (action === 'deletePermanently') {
                    if (item.type === 'document') {
                        documentService.deleteDocumentPermanently(item.id);
                    } else if (item.type === 'group') {
                        groupService.deleteGroupPermanently(item.id);
                    }
                }
            });
        };

        $scope.emptyTrash = function() {};
    }

    function Dialog($scope, $mdDialog) {
        $scope.restore = function() {
            $mdDialog.hide('restore');
        };

        $scope.deletePermanently = function() {
            $mdDialog.hide('deletePermanently');
        };
    }
}());
