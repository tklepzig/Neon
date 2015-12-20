(function() {
    'use strict';

    angular.module('toggleFullscreen', ['fullscreenService']).
    directive('toggleFullscreen', toggleFullscreen);

    function toggleFullscreen($document, fullscreenService) {

        var iconName = fullscreenService.isFullscreen() ? 'fullscreen_exit' : 'fullscreen';

        return {
            restrict: 'E',
            template: '<md-button ng-show-touch class="md-icon-button" ng-click="toggleFullscreen()"><md-icon md-font-set="material-icons">' + iconName + '</md-icon></md-button>',
            link: function(scope, element) {

                $document.on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function() {
                    element.find('md-icon').text(fullscreenService.isFullscreen() ? 'fullscreen_exit' : 'fullscreen');
                });

                scope.toggleFullscreen = function() {
                    fullscreenService.toggle();
                };

            }
        };
    }
}());
