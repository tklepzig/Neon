(function() {
    'use strict';

    angular.module('trash', ['documentService', 'itemsView'])
        .config(defineRoutes)
        .controller('TrashController', TrashController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/trash', {
            templateUrl: 'app/trash/trash.html',
            controller: 'TrashController'
        });
    }

    function TrashController($scope, documentService) {
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
