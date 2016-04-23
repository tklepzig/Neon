(function() {
    'use strict';

    angular.module('group', ['documentService', 'groupService', 'setFocus', 'priorityMenu', 'moveItemMenu'])
        .config(defineRoutes)
        .controller('GroupController', GroupController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/group/:id', {
            templateUrl: 'app/group/group.html',
            controller: 'GroupController'
        });
    }

    function GroupController($scope, $routeParams, $location, $mdDialog, documentService, groupService) {
        $scope.focusName = false;
        $scope.group = {};
        $scope.metadata = {};

        $scope.view = 'grid';
        $scope.flexValues = {
            xs: 50,
            sm: 33,
            md: 25,
            lg: 20,
            xl: 15
        };

        groupService.getGroup($routeParams.id).then(function(group) {
            $scope.group = group.group;
            $scope.metadata = group.metadata;

            if ($scope.group.name.length === 0) {
                $scope.focusName = true;
            }
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
                $location.path('/document/' + document.id + '/edit').replace();
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
                $scope.flexValues = {
                    xs: 100,
                    sm: 100,
                    md: 100,
                    lg: 100,
                    xl: 100
                };
            } else if ($scope.view === 'lines') {
                $scope.view = 'grid';
                $scope.flexValues = {
                    xs: 50,
                    sm: 33,
                    md: 25,
                    lg: 20,
                    xl: 15
                };
            }
        };

        // TODO: add hover functions (Edit)
    }
}());
