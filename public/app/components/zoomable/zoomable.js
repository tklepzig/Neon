// //zooming
// //disable browser's mouse-wheel zooming
// $(document).on('mousewheel DOMMouseScroll', function(e) {
//     if (e.ctrlKey) {
//         e.preventDefault();
//         return false;
//     }
// });
//
// //enable zooming of document
// $('#document > textarea, #document > pre, #document > div').on('mousewheel DOMMouseScroll', function(e) {
//     if (e.ctrlKey) {
//         var eo = e.originalEvent;
//         var delta = eo.wheelDelta || -eo.detail;
//
//         if (delta > 0)
//             $('#document > textarea, #document > pre, #document > div').css('font-size', '+=2px');
//         else if (delta < 0)
//             $('#document > textarea, #document > pre, #document > div').css('font-size', '-=2px');
//
//         e.preventDefault();
//     }
// });

(function() {
    'use strict';

    angular.module('zoomable', [])
        .directive('zoomable', zoomable);

    function zoomable() {
        return function(scope, element) {

            function keyPress(event) {
                if (event.ctrlKey && event.which === 48) {
                    //Ctrl + 0
                    element.css('font-size', '');
                    event.preventDefault();
                }
            }

            function mouseScroll(event) {
                if (event.ctrlKey) {
                    var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
                    if (delta > 0) {
                        element.css('font-size', '+=0.2em');
                    } else if (delta < 0) {
                        element.css('font-size', '-=0.2em');
                    }
                    event.preventDefault();
                }
            }

            element.bind('keydown keypress', keyPress);
            element.bind('mousewheel DOMMouseScroll', mouseScroll);
        };
    }
})();
