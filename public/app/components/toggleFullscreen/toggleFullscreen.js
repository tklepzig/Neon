(function() {
    'use strict';

    angular.module('toggleFullscreen', ['fullscreenService']).
    directive('toggleFullscreen', toggleFullscreen);

    function toggleFullscreen($document, fullscreenService) {


        return {
            restrict: 'E',
            templateUrl: 'app/components/toggleFullscreen/toggleFullscreen.html',
            controller: function($scope) {
                $scope.iconName = fullscreenService.isFullscreen() ? 'fullscreen_exit' : 'fullscreen';
                $scope.label = fullscreenService.isFullscreen() ? 'Exit Fullscreen' : 'Enter Fullscreen';

                $document.on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function() {
                    $scope.iconName = fullscreenService.isFullscreen() ? 'fullscreen_exit' : 'fullscreen';
                    $scope.label = fullscreenService.isFullscreen() ? 'Exit Fullscreen' : 'Enter Fullscreen';
                });

                $scope.toggleFullscreen = function() {
                    fullscreenService.toggle();
                };

            }
        };
    }
}());
