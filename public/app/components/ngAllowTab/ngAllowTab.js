(function() {
    'use strict';

    var SPACE_COUNT = 4;

    angular.module('ngAllowTab', [])
        .directive('ngAllowTab', ngAllowTab);


    function ngAllowTab() {
        return function(scope, element) {
            element.bind('keydown', function(e) {
                if (e.which === 9 && !e.ctrlKey && !e.altKey) {
                    e.preventDefault();
                    var start = this.selectionStart;
                    var end = this.selectionEnd;

                    var tabString = '';
                    var charCount = 0;

                    for (var i = 0; i < SPACE_COUNT; i++) {
                        tabString += ' ';
                    }

                    charCount = SPACE_COUNT;

                    if (e.shiftKey) {
                        var charsBefore = element.val().substring(start - charCount, start);

                        for (i = charCount; i > 0; i--) {
                            if (charsBefore[i - 1] !== ' ') {
                                charCount -= i;
                                break;
                            }
                        }

                        if (charCount > 0) {
                            element.val(element.val().substring(0, start).slice(0, -charCount) + element.val().substring(end));
                            this.selectionStart = this.selectionEnd = element.val().substring(0, start).length - charCount;
                        }
                    } else {
                        element.val(element.val().substring(0, start) + tabString + element.val().substring(end));
                        this.selectionStart = this.selectionEnd = start + charCount;
                    }

                    element.triggerHandler('change');
                }
            });
        };
    }
})();
