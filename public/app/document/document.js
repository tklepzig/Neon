(function() {
    'use strict';

    angular.module('document', ['ngRoute', 'document.edit', 'documentService', 'vibrationService', 'itemOptions'])
        .config(defineRoutes)
        .controller('DocumentController', DocumentController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/document/:id', {
            templateUrl: 'app/document/document.html',
            controller: 'DocumentController' //,
                // hotkeys: [
                //     ['e', 'Edit', 'edit()'],
                //     ['esc', 'Back', 'back()']
                // ]
        });
    }

    function DocumentController($scope, $location, $routeParams, documentService, vibrationService) {
        $scope.ready = false;
        $scope.document = {};
        $scope.metadata = {};

        $('pagedown-viewer').on('click', 'a', function() {
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
                $location.path('/').replace();
            } else {
                //parent is group
                $location.path('/group/' + $scope.metadata.parentId).replace();
            }
        };

        $scope.edit = function() {
            $location.path('/document/' + $scope.document.id + '/edit').replace();
        };
    }
}());
