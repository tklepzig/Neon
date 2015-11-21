(function() {

    'use strict';

    angular.module('editInPlace', [])
        .directive('editInPlace', editInPlace);

    function editInPlace() {
        return {
            restrict: 'E',
            scope: {
                ev: '=',
                dv: '=',
                handleChange: '&onChange'
            },
            template: '<span ng-click="edit()" ng-bind="dv"></span><input ng-model="ev" ng-model-options="{ debounce: 800 }" ng-change="change()"></input>',
            link: function($scope, element) {
                // Let's get a reference to the input element, as we'll want to reference it.
                var inputElement = angular.element(element.children()[1]);

                // This directive should have a set class so we can style it.
                element.addClass('edit-in-place');

                // Initially, we're not editing.
                $scope.editing = false;

                // ng-click handler to activate edit-in-place
                $scope.edit = function() {
                    $scope.editing = true;

                    // We control display through a class on the directive itself. See the CSS.
                    element.addClass('active');

                    // And we must focus the element.
                    // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function,
                    // we have to reference the first element in the array.
                    inputElement[0].focus();
                    inputElement[0].select();
                };

                $scope.change = function() {

                    $scope.handleChange({
                        value: $scope.ev
                    });
                };

                function endEdit() {
                    $scope.editing = false;
                    element.removeClass('active');
                }

                // When we leave the input, we're done editing.
                inputElement.prop('onblur', function() {
                    endEdit();
                });

                inputElement.bind('keypress', function(e) {
                    if (e.keyCode === 13 || e.keyCode === 27) {
                        endEdit();
                    }
                });

                inputElement.bind('keydown', function(e) {
                    if (e.keyCode === 27) {
                        endEdit();
                    }
                });
            }
        };
    }
})();
