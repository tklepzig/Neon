(function() {
    'use strict';

    angular.module('trash', ['documentService', 'itemsView', 'trash.group', 'trash.document'])
        .config(defineRoutes)
        .controller('Trash', Trash);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/trash', {
            templateUrl: 'app/trash/trash.html',
            controller: 'Trash'
        });
    }

    function Trash($scope, $location, documentService, vibrationService) {
        $scope.ready = false;
        $scope.deletedItems = {};
        $scope.view = 'grid';

        documentService.getAllDocuments().then(function(items) {
            $scope.deletedItems = items;
            $scope.ready = true;
        });

        $scope.back = function() {
            vibrationService.vibrate(20);
            $location.path('/').replace();
        };

        $scope.openItem = function(item) {
            if (item.type === 'document') {
                $location.path('/trash/document/' + item.id).replace();
            } else if (item.type === 'group') {
                $location.path('/trash/group/' + item.id).replace();
            }
        };

        $scope.emptyTrash = function() {};
    }
}());
