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

    function StartController($scope, $rootScope, $localStorage, $window, $location, $mdDialog, documentService) {
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
            e.stopPropagation();
            e.preventDefault();
            $location.path('/document/' + document.id + '/edit');
        };

        $scope.deleteDocument = function(document, e) {

            e.stopPropagation();
            e.preventDefault();

            var docName = '';
            if (document.name.length > 0) {
                docName = ' "' + document.name + '" ';
            }

            var confirm = $mdDialog.confirm()
                .title('Delete Document?')
                .content('Are you sure to delete the document' + docName + '?')
                // .ariaLabel('Lucky day')
                .targetEvent(e)
                .theme($rootScope.currentTheme)
                .ok('Yes, delete')
                .cancel('No');
            $mdDialog.show(confirm).then(function() {
                documentService.removeDocument(document.id);
            });
        };
    }
}());
