(function() {
    'use strict';

    angular.module('group', ['documentService', 'groupService', 'setFocus'])
        .config(defineRoutes)
        .controller('GroupController', GroupController);

    function defineRoutes($routeProvider) {
        $routeProvider.when('/group/:id', {
            templateUrl: 'app/group/group.html',
            controller: 'GroupController'
        });
    }

    function GroupController($scope, $routeParams, $location, $mdDialog, documentService, groupService) {
        $scope.focusName = false;

        groupService.getGroup($routeParams.id).then(function(group) {
            $scope.group = group.group;
            $scope.metadata = group.metadata;

            if ($scope.group.name.length === 0) {
                $scope.focusName = true;
            }
        });

        //DRY
        $scope.getAliasDocumentName = function(document) {
            var indexOfFirstLineBreak = document.text.indexOf('\r\n');
            if (indexOfFirstLineBreak === -1) {
                return document.text;
            }
            return document.text.substring(0, indexOfFirstLineBreak);
        };

        $scope.back = function() {
            if (typeof $scope.metadata.parentId === 'undefined') {
                //parent is root
                $location.path('/');
            } else {
                //parent is group
                $location.path('/group/' + $scope.metadata.parentId);
            }
        };

        $scope.openItem = function(item) {
            if (item.type === 'document') {
                $location.path('/document/' + item.id);
            } else if (item.type === 'group') {
                $location.path('/group/' + item.id);
            }
        };

        $scope.nameKeyDown = function(e) {
            //escape or enter
            if (e.keyCode === 27 || e.keyCode === 13) {
                //ensure to trigger watcher by setting to true and afterwards to false
                $scope.focusName = true;
                $scope.focusName = false;
                e.preventDefault();
                e.stopPropagation();
            }
        };


        $scope.addGroup = function() {
            groupService.addGroup($scope.group.id).then(function(group) {
                $location.path('/group/' + group.id);
            });
        };

        $scope.addDocument = function() {
            documentService.addDocument($scope.group.id).then(function(document) {
                $location.path('/document/' + document.id + '/edit');
            });
        };

        $scope.update = function() {
            groupService.updateGroup($scope.group);
        };

        $scope.delete = function(e) {
            var groupName = '';
            if ($scope.group.name.length > 0) {
                groupName = ' "' + $scope.group.name + '" ';
            }

            var confirm = $mdDialog.confirm()
                .title('Delete the group' + groupName + '?')
                .content('This action can\'t be undone.')
                .targetEvent(e)
                .ok('Yes, delete')
                .cancel('No');
            $mdDialog.show(confirm).then(function() {
                groupService.removeGroup($scope.group.id);
                $scope.back();
            });
        };

        // TODO: add hover functions (Edit)
    }
}());
