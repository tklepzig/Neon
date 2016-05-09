(function() {
    'use strict';

    angular.module('toggleFullscreen', ['fullscreenService']).
    directive('toggleFullscreen', toggleFullscreen);

    function toggleFullscreen($document, fullscreenService) {


        return {
            restrict: 'E',
            templateUrl: 'app/components/toggleFullscreen/toggleFullscreen.html',
            controller: function($scope) {
                $scope.isFullscreen = fullscreenService.isFullscreen();

                $document.on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function() {
                    $scope.isFullscreen = fullscreenService.isFullscreen();
                });

                $scope.toggleFullscreen = function() {
                    fullscreenService.toggle();
                };

            }
        };
    }
}());
