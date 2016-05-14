(function() {
    'use strict';

    angular.module('trash.group', ['documentService', 'itemsView'])
        .config(defineRoutes)
        .controller('Group', Group);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/trash/group/:id', {
            templateUrl: 'app/trash/group/group.html',
            controller: 'Group'
        });
    }

    function Group($scope, $routeParams, $location, groupService, vibrationService) {
        $scope.ready = false;
        $scope.group = {};
        $scope.metadata = {};
        $scope.view = 'grid';

        groupService.getGroup($routeParams.id).then(function(group) {
            $scope.group = group.group;
            $scope.metadata = group.metadata;
            $scope.ready = true;
        });

        $scope.back = function() {
            vibrationService.vibrate(20);

            if (typeof $scope.metadata.parentId === 'undefined') {
                //parent is root
                $location.path('/trash').replace();
            } else {
                //parent is group
                $location.path('/trash/group/' + $scope.metadata.parentId).replace();
            }
        };

        $scope.openItem = function(item) {
            if (item.type === 'document') {
                $location.path('/trash/document/' + item.id).replace();
            } else if (item.type === 'group') {
                $location.path('/trash/group/' + item.id).replace();
            }
        };
    }
}());
