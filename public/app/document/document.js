(function() {
    'use strict';

    angular.module('document', ['ngRoute', 'document.edit', 'documentService'])
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

    function DocumentController($scope, $location, $routeParams, $mdDialog, documentService) {
        documentService.getDocument($routeParams.id).then(function(document) {
            $scope.document = document.document;
            $scope.metadata = document.metadata;
        });

        $scope.back = function() {
            if (typeof $scope.metadata.parentId === 'undefined') {
                //parent is root
                $location.path('/');
            } else {
                //parent is group
                $location.path('/group/' + $scope.metadata.parentId);
            }
        };

        // $scope.delete = function(e) {
        //     var documentName = '';
        //     if ($scope.document.name.length > 0) {
        //         documentName = ' "' + $scope.document.name + '" ';
        //     }
        //
        //     var confirm = $mdDialog.confirm()
        //         .title('Delete the document' + documentName + '?')
        //         .content('This action can\'t be undone.')
        //         .targetEvent(e)
        //         .ok('Yes, delete')
        //         .cancel('No');
        //     $mdDialog.show(confirm).then(function() {
        //         documentService.removeDocument($scope.document.id);
        //         $location.path('/');
        //     });
        // };

        $scope.edit = function() {
            $location.path('/document/' + $scope.document.id + '/edit');
        };
    }
}());
