(function() {
    'use strict';

    angular.module('groupService', [])
        .factory('groupService', groupService);

    function groupService($q, socketService) {
        var module = {};

        module.getMoveToGroupList = function(item) {
            var deferred = $q.defer();
            socketService.emit('getMoveToGroupList', item, function(groups) {
                deferred.resolve(groups);
            });
            return deferred.promise;
        };

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

        module.moveGroup = function(id, oldParentId, newParentId) {
            var deferred = $q.defer();
            socketService.emit('moveItem', id, oldParentId, newParentId, function() {
                deferred.resolve();
            });
            return deferred.promise;
        };

        return module;
    }
}());
