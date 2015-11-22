(function() {
    'use strict';

    angular.module('start', ['ngRoute', 'documentService', 'document'])
        .config(defineRoutes)
        .controller('StartController', StartController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/start/start.html',
            controller: 'StartController'
        });
    }

    function StartController($scope, $localStorage, $window, $location, documentService) {
        documentService.getAllDocuments().then(function(documents) {
            $scope.documents = documents;
        });

        $scope.openDocument = function(document) {
            $location.path('/document/' + document.id);
        };

        $scope.addDocument = function() {
            documentService.addDocument().then(function(document) {
                $scope.document = document;
                $location.path('/document/' + document.id + '/edit');
            });
        };

        $scope.editDocument = function(document, e) {
            $location.path('/document/' + document.id + '/edit');
            e.stopPropagation();
            e.preventDefault();
        };
    }
}());
