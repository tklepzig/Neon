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

    function DocumentController($scope, $location, $routeParams, documentService) {
        documentService.getDocument($routeParams.id).then(function(document) {
            $scope.document = document;
        });

        $scope.back = function() {
            $location.path('/');
        };

        $scope.edit = function() {
            $location.path('/document/' + $scope.document.id + '/edit');
        };

        //possible (ugly) workaround if bug in angular hotkey isn't fixed
        // $document.bind('keydown', function(e) {
        //     var preventDefault = false;
        //
        //     if (e.keyCode === 'E'.charCodeAt(0) && e.ctrlKey && !e.shiftKey && !e.altKey) {
        //         //CTRL + E -> edit
        //         preventDefault = true;
        //         $scope.edit();
        //         $scope.$apply();
        //     } else if (e.keyCode === 'S'.charCodeAt(0) && e.ctrlKey && !e.shiftKey && !e.altKey) {
        //         //prevent showing browser 'save as' dialog for CTRL + S lovers...
        //         preventDefault = true;
        //     }
        //
        //     if (preventDefault) {
        //         e.preventDefault();
        //         return false;
        //     }
        // });
    }
}());
