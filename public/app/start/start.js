(function() {
    'use strict';

    angular.module('start', ['ngRoute', 'documentService', 'document', 'group', 'fabAdd', 'orderByPriority'])
        .config(defineRoutes)
        .controller('StartController', StartController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/start/start.html',
            controller: 'StartController'
        });
    }

    function StartController($scope, $localStorage, $location, $mdDialog, documentService, groupService) {
        documentService.getAllDocuments().then(function(documents) {
            $scope.items = documents;
        });

        $scope.hoveredDocument = null;
        $scope.searchQuery = '';
        $scope.showSearch = false;

        $scope.searchFilter = function(document) {
            var re = new RegExp($scope.searchQuery, 'i');
            return !$scope.searchQuery || re.test(document.name) || re.test(document.text);
        };

        $scope.startSearch = function() {
            $scope.showSearch = true;

            // TODO: improve this
            setTimeout(function() {
                document.getElementById('search').focus();
            });
        };

        $scope.endSearch = function() {
            $scope.search = '';
            $scope.showSearch = false;
        };

        $scope.mouseEnter = function(document) {
            $scope.hoveredDocument = document;
        };

        $scope.mouseLeave = function() {
            $scope.hoveredDocument = null;
        };

        $scope.openItem = function(item) {
            if (item.type === 'document') {
                $location.path('/document/' + item.id);
            } else if (item.type === 'group') {
                $location.path('/group/' + item.id);
            }
        };

        $scope.addGroup = function() {
            groupService.addGroup().then(function(group) {
                $location.path('/group/' + group.id);
            });
        };

        $scope.addDocument = function() {
            documentService.addDocument().then(function(document) {
                $location.path('/document/' + document.id + '/edit');
            });
        };

        $scope.editDocument = function(document, e) {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            $location.path('/document/' + document.id + '/edit');
        };
    }
}());
