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
            templateUrl: 'app/components/priorityMenu/priorityMenu.html'
        };
    }
})();
