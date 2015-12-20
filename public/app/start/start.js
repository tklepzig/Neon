(function() {
    'use strict';

    angular.module('start', ['ngRoute', 'documentService', 'document', 'touchService'])
        .config(defineRoutes)
        .controller('StartController', StartController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/start/start.html',
            controller: 'StartController'
        });
    }

    function StartController($scope, $rootScope, $localStorage, $location, $mdDialog, documentService, touchService) {
        documentService.getAllDocuments().then(function(documents) {
            $scope.documents = documents;
        });

        $scope.hoveredDocument = null;

        $scope.mouseEnter = function(document) {
            $scope.hoveredDocument = document;
        };

        $scope.mouseLeave = function() {
            $scope.hoveredDocument = null;
        };

        $scope.isTouchSupported = touchService.isSupported();

        $scope.openDocument = function(document) {
            $location.path('/document/' + document.id);
        };

        $scope.addDocument = function() {
            documentService.addDocument().then(function(document) {
                $scope.document = document;
                $location.path('/document/' + document.id + '/edit');
            });
        };

        $scope.showMenu = function(document, e) {
            e.stopPropagation();
            e.preventDefault();
            window.alert('show menu');
        };

        $scope.editDocument = function(document, e) {

            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }

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
