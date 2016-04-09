(function() {
    'use strict';

    angular.module('group', ['documentService', 'groupService'])
        .config(defineRoutes)
        .controller('GroupController', GroupController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/group/:id', {
            templateUrl: 'app/group/group.html',
            controller: 'GroupController'
        });
    }

    function GroupController($scope, $routeParams, $location, documentService, groupService) {
        $scope.focusName = false;

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

        // TODO: add hover functions (Edit)
    }
}());
