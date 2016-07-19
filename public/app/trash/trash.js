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

    function Trash($scope, $location, $mdDialog, documentService, vibrationService) {
        $scope.ready = false;
        $scope.deletedItems = {};
        $scope.view = 'grid';

        documentService.getDeletedItems().then(function(items) {
            $scope.deletedItems = items;
            $scope.ready = true;
        });

        $scope.back = function() {
            vibrationService.vibrate(20);
            $location.path('/').replace();
        };

        $scope.showPopup = function(e) {
            $mdDialog.show({
                controller: Dialog,
                templateUrl: 'app/trash/dialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: e,
                clickOutsideToClose: true
            });
        };

        $scope.emptyTrash = function() {};
    }

    function Dialog($scope, $mdDialog) {
        $scope.restore = function() {
            //TODO: restore
            $mdDialog.hide();
        };

        $scope.deletePermanently = function() {
            //TODO: delete permanently
            $mdDialog.hide();
        };
    }
}());
