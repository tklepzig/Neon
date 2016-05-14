(function() {
    'use strict';

    angular.module('trash.document', [])
        .config(defineRoutes)
        .controller('Document', Document);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/trash/document/:id', {
            templateUrl: 'app/trash/document/document.html',
            controller: 'Document'
        });
    }

    function Document() {}
}());
