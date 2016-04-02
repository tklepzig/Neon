(function() {
    'use strict';

    angular.module('group', ['groupService'])
        .config(defineRoutes)
        .controller('GroupController', GroupController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/group/:id', {
            templateUrl: 'app/group/group.html',
            controller: 'GroupController'
        });
    }

    function GroupController($scope, $routeParams, $location, groupService) {
        groupService.getGroup($routeParams.id).then(function(group) {
            $scope.group = group.group;
            $scope.metadata = group.metadata;
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

        // TODO: add hover functions (Edit)
        // TODO: add keyboard shortcuts
    }
}());
