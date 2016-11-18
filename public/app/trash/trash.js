(function () {
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

    function Trash($scope, $location, $window, $mdDialog, documentService, groupService, vibrationService) {
        $scope.ready = false;
        $scope.deletedItems = {};
        $scope.view = 'grid';

        documentService.getDeletedItems().then(function (items) {
            $scope.deletedItems = items;
            $scope.ready = true;
        });

        $scope.back = function () {
            vibrationService.vibrate(20);
            $location.path('/').replace();
        };

        $scope.showPopup = function (item, e) {
            $mdDialog.show({
                controller: Dialog,
                templateUrl: 'app/trash/dialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: e,
                clickOutsideToClose: true
            }).then(function (action) {
                if (action === 'restore') {
                    if (item.type === 'document') {
                        documentService.restoreDocument(item.id);
                    } else if (item.type === 'group') {
                        groupService.restoreGroup(item.id);
                    }

                    $window.location.reload();

                } else if (action === 'deletePermanently') {
                    var itemName = '';
                    if (item.name.length > 0) {
                        itemName = ' "' + item.name + '"';
                    }
                    var confirm = $mdDialog.confirm()
                        .title('Delete the ' + item.type + itemName + ' permanently?')
                        .content('This action can\'t be undone.')
                        .ok('Yes, delete')
                        .cancel('No');

                    if (typeof e !== 'undefined') {
                        confirm.targetEvent(e);
                    }
                    $mdDialog.show(confirm).then(function () {
                        if (item.type === 'document') {
                            documentService.deleteDocumentPermanently(item.id);
                        } else if (item.type === 'group') {
                            groupService.deleteGroupPermanently(item.id);
                        }

                        $window.location.reload();
                    });
                }

            });
        };

        $scope.emptyTrash = function (e) {

            var confirm = $mdDialog.confirm()
                .title('Delete all items permanently?')
                .content('This action can\'t be undone.')
                .ok('Yes, delete')
                .cancel('No');

            if (typeof e !== 'undefined') {
                confirm.targetEvent(e);
            }
            $mdDialog.show(confirm).then(function () {
                documentService.emptyTrash();
                $location.path('/').replace();
            });

        };
    }

    function Dialog($scope, $mdDialog) {
        $scope.restore = function () {
            $mdDialog.hide('restore');
        };

        $scope.deletePermanently = function () {
            $mdDialog.hide('deletePermanently');
        };
    }
} ());
