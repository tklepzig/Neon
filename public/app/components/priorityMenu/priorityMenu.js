(function() {
    'use strict';

    angular.module('priorityMenu', [])
        .directive('priorityMenu', priorityMenu);

    function priorityMenu() {
        return {
            restrict: 'E',
            scope: {
                setPriority: '&'
            },
            templateUrl: 'app/components/priorityMenu/priorityMenu.html',
            controller: function($scope, $timeout) {
                $scope.open = function($mdOpenMenu, $event) {
                    //give some time to close touch keyboard on mobile devices
                    //otherwise the menu would be super small due to the document size change
                    $timeout(function() {
                        $mdOpenMenu($event);
                    }, 200);
                };
            }
        };
    }
})();
