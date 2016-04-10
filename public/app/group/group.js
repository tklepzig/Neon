(function() {
    'use strict';

    angular.module('group', ['documentService', 'groupService', 'setFocus'])
        .config(defineRoutes)
        .controller('GroupController', GroupController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/group/:id', {
            templateUrl: 'app/group/group.html',
            controller: 'GroupController'
        });
    }

    function GroupController($scope, $routeParams, $location, $mdDialog, $filter, documentService, groupService) {
        $scope.focusName = false;

        groupService.getGroup($routeParams.id).then(function(group) {
            $scope.group = group.group;
            $scope.metadata = group.metadata;

            if ($scope.group.name.length === 0) {
                $scope.focusName = true;
            }
        });

        //DRY
        $scope.getItemName = function(item) {
            if (item.name.length > 0) {
                return item.name;
            } else if (item.type === 'document') {
                var indexOfFirstLineBreak = item.text.indexOf('\r\n');
                if (indexOfFirstLineBreak === -1) {
                    return item.text;
                }
                return item.text.substring(0, indexOfFirstLineBreak);
            } else {
                return $filter('translate')('Group.Unnamed');
            }
        };
        $scope.getItemCssClass = function(item) {
            return item.type === 'group' ? 'md-3-line' : '';
        };

        $scope.back = function() {
            if (typeof $scope.metadata.parentId === 'undefined') {
                //parent is root
                $location.path('/');
            } else {
                //parent is group
                $location.path('/group/' + $scope.metadata.parentId);
            }
        };

        $scope.openItem = function(item) {
            if (item.type === 'document') {
                $location.path('/document/' + item.id);
            } else if (item.type === 'group') {
                $location.path('/group/' + item.id);
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
                $location.path('/group/' + group.id);
            });
        };

        $scope.addDocument = function() {
            documentService.addDocument($scope.group.id).then(function(document) {
                $location.path('/document/' + document.id + '/edit');
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

        // TODO: add hover functions (Edit)
    }
}());
