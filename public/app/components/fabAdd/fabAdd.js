(function() {
    'use strict';

    angular.module('fabAdd', [])
        .directive('fabAdd', fabAdd);

    function fabAdd() {
        return {
            restrict: 'E',
            scope: {
                ngClickDocument: '&',
                ngClickGroup: '&'
            },
            templateUrl: 'app/components/fabAdd/fabAdd.html'
        };
    }
})();
