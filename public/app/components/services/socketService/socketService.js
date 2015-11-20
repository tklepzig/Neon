(function() {
    'use strict';

    angular.module('socketService', [])
        .factory('socketService', socketService);

    function socketService(socketFactory) {
        return socketFactory();
    }
}());
