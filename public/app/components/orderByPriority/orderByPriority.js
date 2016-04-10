(function() {
    'use strict';

    angular.module('orderByPriority', [])
        .filter('orderByPriority', orderByPriority);

    function orderByPriority() {
        function getPriorityAsNumber(priority) {
            switch (priority) {
                case 'high':
                    return 1;
                case 'medium':
                    return 2;
                case 'low':
                    return 3;
                case 'none':
                    return 4;
            }
        }

        return function(items) {
            var filtered = [];
            angular.forEach(items, function(item) {
                filtered.push(item);
            });
            filtered.sort(function(a, b) {
                return (getPriorityAsNumber(a.priority) > getPriorityAsNumber(b.priority) ? 1 : -1);
            });
            return filtered;
        };
    }
})();
