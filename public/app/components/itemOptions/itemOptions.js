(function() {
    'use strict';

    angular.module('itemOptions', ['documentService', 'groupService', 'fullscreenService'])
        .directive('itemOptions', itemOptions);

    function itemOptions() {
        return {
            restrict: 'E',
            scope: {
                item: '=',
                moveToGroupList: '=',
                currentView: '=',
                isEditMode: '=?',
                move: '&',
                setPriority: '&',
                delete: '&',
                toggleView: '&'
            },
            templateUrl: 'app/components/itemOptions/itemOptions.html',
            controller: function($scope, $rootScope, $timeout, $location, $mdDialog, $document, documentService, groupService, touchService, fullscreenService) {
                $scope.getItemName = $rootScope.getItemName;
                $scope.touchSupported = touchService.isSupported();
                $scope.isFullscreen = fullscreenService.isFullscreen();
                $scope.isEditMode = angular.isDefined($scope.isEditMode) ? $scope.isEditMode : false;

                $scope.openMenu = function($mdOpenMenu, $event) {
                    if ($scope.touchSupported) {
                        //give some time to close touch keyboard on mobile devices
                        //otherwise the menu would be super small due to the document size change
                        $timeout(function() {
                            $mdOpenMenu($event);
                        }, 200);
                    } else {
                        $mdOpenMenu($event);
                    }
                };

                $document.on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function() {
                    $scope.isFullscreen = fullscreenService.isFullscreen();
                });

                $scope.toggleFullscreen = function() {
                    fullscreenService.toggle();
                };
            }
        };
    }
})();
