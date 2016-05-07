(function() {
    'use strict';

    angular.module('group', ['document', 'fabAdd', 'documentService', 'groupService', 'vibrationService', 'setFocus', 'itemOptions'])
        .config(defineRoutes)
        .controller('GroupController', GroupController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/group/:id', {
            templateUrl: 'app/group/group.html',
            controller: 'GroupController',
            resolve: {
                isRoot: function() {
                    return false;
                }
            }
        });
        $routeProvider.when('/', {
            templateUrl: 'app/group/group.html',
            controller: 'GroupController',
            resolve: {
                isRoot: function() {
                    return true;
                }
            }
        });
    }

    function GroupController(isRoot, $scope, $routeParams, $location, $mdDialog, documentService, groupService, vibrationService) {
        $scope.ready = false;
        $scope.isRoot = isRoot;

        // $scope.hoveredDocument = null;
        // $scope.searchQuery = '';
        // $scope.showSearch = false;

        $scope.focusName = false;
        $scope.group = {};
        $scope.metadata = {};
        $scope.moveToGroups = [];

        $scope.view = 'grid';
        $scope.flexValues = {
            xs: 50,
            sm: 33,
            md: 25,
            lg: 20
        };

        if (isRoot) {
            documentService.getAllDocuments().then(function(items) {
                $scope.group = {
                    children: items
                };
                $scope.metadata = {};
                $scope.ready = true;
            });
        } else {
            groupService.getGroup($routeParams.id).then(function(group) {
                $scope.group = group.group;
                $scope.metadata = group.metadata;

                if ($scope.group.name.length === 0) {
                    $scope.focusName = true;
                }

                groupService.getMoveToGroups($scope.group, $scope.metadata.parentId).then(function(groups) {
                    $scope.moveToGroups = groups;
                    $scope.ready = true;
                });
            });
        }

        // $scope.searchFilter = function(document) {
        //     var re = new RegExp($scope.searchQuery, 'i');
        //     return !$scope.searchQuery || re.test(document.name) || re.test(document.text);
        // };
        //
        // $scope.startSearch = function() {
        //     $scope.showSearch = true;
        //
        //     // TODO: improve this
        //     setTimeout(function() {
        //         document.getElementById('search').focus();
        //     });
        // };
        //
        // $scope.endSearch = function() {
        //     $scope.search = '';
        //     $scope.showSearch = false;
        // };
        //
        // $scope.mouseEnter = function(document) {
        //     $scope.hoveredDocument = document;
        // };
        //
        // $scope.mouseLeave = function() {
        //     $scope.hoveredDocument = null;
        // };

        $scope.back = function() {
            if (isRoot) {
                return;
            }

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
            //if root, $scope.group.id is undefined
            groupService.addGroup($scope.group.id).then(function(group) {
                $location.path('/group/' + group.id).replace();
            });
        };

        $scope.addDocument = function() {
            //if root, $scope.group.id is undefined
            documentService.addDocument($scope.group.id).then(function(document) {
                $location.path('/document/' + document.id + '/edit/0').replace();
            });
        };

        $scope.update = function() {
            if (isRoot) {
                return;
            }

            groupService.updateGroup($scope.group);
        };

        $scope.delete = function(e) {
            if (isRoot) {
                return;
            }

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
            if (isRoot) {
                return;
            }

            $scope.group.priority = priority;
            groupService.updateGroup($scope.group);
        };

        $scope.moveToGroup = function(groupId) {
            if (isRoot) {
                return;
            }

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
                    lg: 100
                };
            } else if ($scope.view === 'lines') {
                $scope.view = 'grid';
                $scope.flexValues = {
                    xs: 50,
                    sm: 33,
                    md: 25,
                    lg: 20
                };
            }
        };
    }
}());
