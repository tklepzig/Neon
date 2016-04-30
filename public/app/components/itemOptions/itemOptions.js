(function() {
    'use strict';

    angular.module('itemOptions', ['priorityMenu', 'moveItemMenu', 'documentService', 'groupService'])
        .directive('itemOptions', itemOptions);

    function itemOptions() {
        return {
            restrict: 'E',
            scope: {
                item: '=',
                parentId: '=',
                ready: '=',
                back: '&'
            },
            templateUrl: 'app/components/itemOptions/itemOptions.html',
            controller: function($scope, $timeout, $location, $mdDialog, documentService, groupService, touchService) {
                $scope.open = function($mdOpenMenu, $event) {
                    if (touchService.isSupported()) {
                        //give some time to close touch keyboard on mobile devices
                        //otherwise the menu would be super small due to the document size change
                        $timeout(function() {
                            $mdOpenMenu($event);
                        }, 200);
                    } else {
                        $mdOpenMenu($event);
                    }
                };

                $scope.delete = function(e) {
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

                $scope.setPriority = function(priority) {
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
            }
        };
    }
})();
