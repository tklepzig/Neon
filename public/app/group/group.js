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
            $scope.group = group;
        });

        $scope.back = function() {
            //if parent is root
                // $location.path('/');
            // if parent is group
                // $location.path('/group/' + parent.id);
        };

        // TODO: add hover functions (Edit)
        // TODO: add keyboard shortcuts
    }
}());
