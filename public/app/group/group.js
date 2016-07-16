(function() {
    'use strict';

    angular.module('group', ['document', 'fabAdd', 'documentService', 'groupService', 'vibrationService', 'setFocus', 'itemOptions', 'itemsView'])
        .config(defineRoutes)
        .controller('GroupController', GroupController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/group/:id', {
            templateUrl: 'app/group/group.html',
            controller: 'GroupController'
        });
    }

    function GroupController($scope, $routeParams, $location, $mdDialog, documentService, groupService, vibrationService) {
        $scope.ready = false;
        $scope.focusName = false;
        $scope.group = {};
        $scope.metadata = {};
        $scope.moveToGroupList = [];
        $scope.view = 'grid';

        groupService.getGroup($routeParams.id).then(function(group) {
            $scope.group = group.group;
            $scope.metadata = group.metadata;

            if ($scope.group.name.length === 0) {
                $scope.focusName = true;
            }

            groupService.getMoveToGroupList($scope.group).then(function(groups) {
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

        $scope.openItem = function(item) {
            if (item.type === 'document') {
                $location.path('/document/' + item.id).replace();
            } else if (item.type === 'group') {
                $location.path('/group/' + item.id).replace();
            }
        };

        $scope.nameKeyDown = function(e) {
            //escape or enter
            if (e.keyCode === 27 || e.keyCode === 13) {
                $scope.focusName = false;
                e.preventDefault();
                e.stopPropagation();
            }
        };

        $scope.addGroup = function() {
            groupService.addGroup($scope.group.id).then(function(group) {
                $location.path('/group/' + group.id).replace();
            });
        };

        $scope.addDocument = function() {
            documentService.addDocument($scope.group.id).then(function(document) {
                $location.path('/document/' + document.id + '/edit/0').replace();
            });
        };

        $scope.update = function() {
            groupService.updateGroup($scope.group);
        };

        $scope.delete = function(e) {
            var groupName = '';
            if ($scope.group.name.length > 0) {
                groupName = ' "' + $scope.group.name + '" ';
            }

            var confirm = $mdDialog.confirm()
                .title('Delete the group' + groupName + '?')
                .content('This action can\'t be undone.')
                .ok('Yes, delete')
                .cancel('No');

            if (typeof e !== 'undefined') {
                confirm.targetEvent(e);
            }
            $mdDialog.show(confirm).then(function() {
                groupService.removeGroup($scope.group.id);
                $scope.back();
            });
        };

        $scope.setPriority = function(priority) {
            $scope.group.priority = priority;
            groupService.updateGroup($scope.group);
        };

        $scope.moveToGroup = function(groupId) {
            groupService.moveGroup($scope.group.id, $scope.metadata.parentId, groupId).then(function() {
                if (typeof groupId === 'undefined') {
                    $location.path('/').replace();
                } else {
                    $location.path('/group/' + groupId).replace();
                }
            });
        };

        $scope.toggleView = function() {
            if ($scope.view === 'grid') {
                $scope.view = 'lines';
            } else if ($scope.view === 'lines') {
                $scope.view = 'grid';
            }
        };
    }
}());
