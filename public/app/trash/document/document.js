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

    function Document($scope, $routeParams, $location, documentService, vibrationService) {
        $scope.ready = false;
        $scope.document = {};
        $scope.metadata = {};

        $(document).on('click', 'pagedown-viewer a', function() {
            $(this).attr('target', '_blank');
        });

        documentService.getDocument($routeParams.id).then(function(document) {
            $scope.document = document.document;
            $scope.metadata = document.metadata;
            $scope.ready = true;
        });

        $scope.back = function() {
            vibrationService.vibrate(20);
            if (typeof $scope.metadata.parentId === 'undefined') {
                //parent is root
                $location.path('/trash').replace();
            } else {
                //parent is group
                $location.path('/trash/group/' + $scope.metadata.parentId).replace();
            }
        };

        $scope.restore = function() {};
        $scope.deletePermanently = function() {};
    }
}());
