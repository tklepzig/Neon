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

        module.addGroup = function(parentGroupId) {
            var deferred = $q.defer();
            socketService.emit('addGroup', parentGroupId, function(group) {
                deferred.resolve(group);
            });
            return deferred.promise;
        };

        module.removeGroup = function(id) {
            socketService.emit('removeGroup', id);
        };

        return module;
    }
}());
