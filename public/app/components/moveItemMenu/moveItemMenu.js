(function() {
    'use strict';

    angular.module('moveItemMenu', ['groupService'])
        .directive('moveItemMenu', moveItemMenu);

    function moveItemMenu($rootScope, groupService) {
        return {
            restrict: 'E',
            scope: {
                moveItem: '&',
                excludeGroupIds: '='
            },
            templateUrl: 'app/components/moveItemMenu/moveItemMenu.html',
            controller: function($scope, $timeout) {
                $scope.show = true;
                $scope.getItemName = $rootScope.getItemName;

                groupService.getAllGroups().then(function(groups) {
                    $scope.groups = groups;
                    if ($scope.groups.length === 0) {
                        $scope.show = false;
                    }
                });

                $scope.open = function($mdOpenMenu, $event) {
                    //give some time to close touch keyboard on mobile devices
                    //otherwise the menu would be super small due to the document size change
                    $timeout(function () {
                        $mdOpenMenu($event);
                    }, 200);
                };
            }
        };
    }
})();
