(function() {
    'use strict';

    angular.module('trash', ['documentService', 'itemsView'])
        .config(defineRoutes)
        .controller('Trash', Trash);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/trash', {
            templateUrl: 'app/trash/trash.html',
            controller: 'Trash'
        });
    }

    function Trash($scope, documentService) {
        $scope.ready = false;
        $scope.deletedItems = {};
        $scope.view = 'grid';

        documentService.getDeletedItems().then(function(items) {
            $scope.deletedItems = items;
            $scope.ready = true;
            console.log(items);
        });
    }
}());
