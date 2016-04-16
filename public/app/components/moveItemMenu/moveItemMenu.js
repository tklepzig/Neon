(function() {
    'use strict';

    angular.module('moveItemMenu', ['groupService'])
        .directive('moveItemMenu', moveItemMenu);

    function moveItemMenu($rootScope, groupService) {
        return {
            restrict: 'E',
            scope: {
                moveItem: '&',
                excludeGroupId: '='
            },
            templateUrl: 'app/components/moveItemMenu/moveItemMenu.html',
            link: function($scope) {
                $scope.show = true;
                $scope.getItemName = $rootScope.getItemName;

                groupService.getAllGroups().then(function(groups) {
                    $scope.groups = groups;
                    if ($scope.groups.length === 0) {
                        $scope.show = false;
                    }
                });
            }
        };
    }
})();
