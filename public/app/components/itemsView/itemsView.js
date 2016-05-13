(function() {
    'use strict';

    angular.module('itemsView', [])
        .directive('itemsView', itemsView);

    function itemsView() {
        return {
            restrict: 'E',
            scope: {
                items: '=',
                ready: '=',
                view: '=',
                openItem: '&'
            },
            templateUrl: 'app/components/itemsView/itemsView.html',
            controller: function($scope, $rootScope) {
                $scope.getItemName = $rootScope.getItemName;
                $scope.getItemTileCssClass = $rootScope.getItemTileCssClass;
                $scope.getPreviewItems = $rootScope.getPreviewItems;
                $scope.view = 'grid';
                $scope.flexValues = {
                    xs: 50,
                    sm: 33,
                    md: 25,
                    lg: 20
                };

                $scope.$watch('view', function(value) {
                    if (value === 'lines') {
                        $scope.flexValues = {
                            xs: 100,
                            sm: 100,
                            md: 100,
                            lg: 100
                        };
                    } else if ($scope.view === 'grid') {
                        $scope.flexValues = {
                            xs: 50,
                            sm: 33,
                            md: 25,
                            lg: 20
                        };
                    }
                });
            }
        };
    }
})();
