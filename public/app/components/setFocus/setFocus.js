(function() {
    'use strict';

    angular.module('setFocus', [])
        .directive('setFocus', setFocus);

    function setFocus($timeout) {
        return {
            scope: {
                trigger: '=setFocus'
            },
            link: function(scope, element) {
                scope.$watch('trigger', function(value) {
                    if (value === true) {
                        $timeout(function() {
                            element[0].focus();
                            if (element[0].selectionStart) {
                                element[0].setSelectionRange(0, 0);
                                if (element[0].scrollTop) {
                                    element[0].scrollTop = 0;
                                }
                            }
                            scope.trigger = false;
                        });
                    }
                });
            }
        };
    }
})();
