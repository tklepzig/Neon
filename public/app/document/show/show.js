(function() {
    'use strict';

    angular.module('showDocument', ['ngRoute'])
        .directive('showDocument', showDocument);

    function showDocument($location) {
        return {
            restrict: 'E',
            document: '=',
            templateUrl: 'app/document/show/show.html',
            link: function(scope, element) {

                scope.back = function() {
                    $location.path('/');
                };

            }
        };
    }
}());
