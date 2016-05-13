(function() {
    'use strict';

    angular.module('start', ['group', 'document', 'fabAdd', 'documentService', 'groupService', 'itemsView'])
        .config(defineRoutes)
        .controller('StartController', StartController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/start/start.html',
            controller: 'StartController'
        });
    }

    function StartController($scope, $location, groupService, documentService) {
        $scope.ready = false;

        // $scope.hoveredDocument = null;
        // $scope.searchQuery = '';
        // $scope.showSearch = false;

        $scope.view = 'grid';

        documentService.getAllDocuments().then(function(items) {
            $scope.items = items;
            $scope.ready = true;
        });

        // $scope.searchFilter = function(document) {
        //     var re = new RegExp($scope.searchQuery, 'i');
        //     return !$scope.searchQuery || re.test(document.name) || re.test(document.text);
        // };
        //
        // $scope.startSearch = function() {
        //     $scope.showSearch = true;
        //
        //     // TODO: improve this
        //     setTimeout(function() {
        //         document.getElementById('search').focus();
        //     });
        // };
        //
        // $scope.endSearch = function() {
        //     $scope.search = '';
        //     $scope.showSearch = false;
        // };
        //
        // $scope.mouseEnter = function(document) {
        //     $scope.hoveredDocument = document;
        // };
        //
        // $scope.mouseLeave = function() {
        //     $scope.hoveredDocument = null;
        // };

        $scope.openItem = function(item) {
            if (item.type === 'document') {
                $location.path('/document/' + item.id).replace();
            } else if (item.type === 'group') {
                $location.path('/group/' + item.id).replace();
            }
        };

        $scope.addGroup = function() {
            groupService.addGroup().then(function(group) {
                $location.path('/group/' + group.id).replace();
            });
        };

        $scope.addDocument = function() {
            documentService.addDocument().then(function(document) {
                $location.path('/document/' + document.id + '/edit/0').replace();
            });
        };

        $scope.toggleView = function() {
            if ($scope.view === 'grid') {
                $scope.view = 'lines';
            } else if ($scope.view === 'lines') {
                $scope.view = 'grid';
            }
        };
    }
}());
