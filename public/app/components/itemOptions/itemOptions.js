(function() {
    'use strict';

    angular.module('itemOptions', ['priorityMenu', 'moveItemMenu'])
        .directive('itemOptions', itemOptions);

    function itemOptions() {
        return {
            restrict: 'E',
            scope: {
                moveItem: '&',
                setPriority: '&',
                deleteItem: '&',
                excludeGroupIds: '='
            },
            templateUrl: 'app/components/itemOptions/itemOptions.html',
            controller: function($scope, $timeout) {
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
