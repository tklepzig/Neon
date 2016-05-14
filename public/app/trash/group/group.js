(function() {
    'use strict';

    angular.module('trash.group', ['documentService', 'itemsView'])
        .config(defineRoutes)
        .controller('Group', Group);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/trash/group/:id', {
            templateUrl: 'app/trash/group/group.html',
            controller: 'Group'
        });
    }

    function Group($scope, $routeParams, documentService) {
        $scope.ready = false;
        $scope.deletedItems = {};
        $scope.view = 'grid';

        documentService.getDeletedItems($routeParams.id).then(function(items) {
            $scope.deletedItems = items;
            $scope.ready = true;
        });
    }
}());
