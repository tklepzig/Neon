(function() {
    'use strict';

    angular.module('itemOptions', ['documentService', 'groupService', 'fullscreenService'])
        .directive('itemOptions', itemOptions);

    function itemOptions() {
        return {
            restrict: 'E',
            scope: {
                item: '=',
                parentId: '=',
                currentView: '=',
                ready: '=',
                back: '&',
                toggleView: '&'
            },
            templateUrl: 'app/components/itemOptions/itemOptions.html',
            controller: function($scope, $rootScope, $timeout, $location, $mdDialog, documentService, groupService, touchService, fullscreenService) {
                $scope.showMoveItemMenu = true;
                $scope.getItemName = $rootScope.getItemName;
                $scope.moveToGroups = [];
                $scope.touchSupported = touchService.isSupported();


                $scope.$watchGroup(['item', 'parentId'], function(values) {
                    var item = values[0];
                    var parentId = values[1];

                    if (typeof item !== 'undefined' && item !== null && !$.isEmptyObject(item)) {
                        groupService.blubb(item, parentId).then(function(groups) {
                            $scope.moveToGroups = groups;
                            if ($scope.moveToGroups.length === 0) {
                                $scope.showMoveItemMenu = false;
                            }
                        });
                    }
                });

                $scope.openMenu = function($mdOpenMenu, $event) {
                    if ($scope.touchSupported) {
                        //give some time to close touch keyboard on mobile devices
                        //otherwise the menu would be super small due to the document size change
                        $timeout(function() {
                            $mdOpenMenu($event);
                        }, 200);
                    } else {
                        $mdOpenMenu($event);
                    }
                };

                $scope.deleteItem = function(e) {
                    var itemName = '';
                    if ($scope.item.name.length > 0) {
                        itemName = ' "' + $scope.item.name + '" ';
                    }

                    var confirm = $mdDialog.confirm()
                        .title('Delete the ' + ($scope.item.type === 'group' ? 'group' : 'document') + itemName + '?')
                        .content('This action can\'t be undone.')
                        .ok('Yes, delete')
                        .cancel('No');

                    if (typeof e !== 'undefined') {
                        confirm.targetEvent(e);
                    }
                    $mdDialog.show(confirm).then(function() {
                        if ($scope.item.type === 'group') {
                            groupService.removeGroup($scope.item.id);
                        } else if ($scope.item.type === 'document') {
                            documentService.removeDocument($scope.item.id);
                        }
                        $scope.back();
                    });
                };

                $scope.setItemPriority = function(priority) {
                    $scope.item.priority = priority;

                    if ($scope.item.type === 'group') {
                        groupService.updateGroup($scope.item);
                    } else if ($scope.item.type === 'document') {
                        documentService.updateDocument($scope.item);
                    }
                };

                $scope.moveItem = function(groupId) {
                    if ($scope.item.type === 'group') {
                        groupService.moveGroup($scope.item.id, $scope.parentId, groupId).then(function() {
                            if (typeof groupId === 'undefined') {
                                $location.path('/').replace();
                            } else {
                                $location.path('/group/' + groupId).replace();
                            }
                        });
                    } else if ($scope.item.type === 'document') {
                        documentService.moveDocument($scope.item.id, $scope.parentId, groupId).then(function() {

                            console.log('fertsch');
                            if (typeof groupId === 'undefined') {
                                $location.path('/').replace();
                            } else {
                                $location.path('/group/' + groupId).replace();
                            }
                        });
                    }
                };

                $scope.toggleFullscreen = function() {
                    fullscreenService.toggle();
                };
            }
        };
    }
})();
