(function() {
    'use strict';

    angular.module('groupService', ['socketService'])
        .factory('groupService', groupService);

    function groupService($q, socketService) {
        var module = {};

        module.getGroup = function(id) {
            var deferred = $q.defer();
            socketService.emit('getGroup', id, function(group) {
                deferred.resolve(group);
            });
            return deferred.promise;
        };

        module.updateGroup = function(group) {
            socketService.emit('updateGroup', group);
        };


        return module;
    }
}());
