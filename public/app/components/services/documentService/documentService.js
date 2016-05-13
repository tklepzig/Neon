(function() {
    'use strict';

    angular.module('documentService', [])
        .factory('documentService', documentService);

    function documentService($q, socketService) {
        var module = {};

        module.getAllDocuments = function() {

            var deferred = $q.defer();
            socketService.emit('getAllDocuments', function(documents) {
                deferred.resolve(documents);
            });

            return deferred.promise;
        };

        module.getDocument = function(id) {
            var deferred = $q.defer();
            socketService.emit('getDocument', id, function(document) {
                deferred.resolve(document);
            });
            return deferred.promise;
        };

        module.updateDocument = function(document) {
            socketService.emit('updateDocument', document);
        };

        module.addDocument = function(parentGroupId) {
            var deferred = $q.defer();
            socketService.emit('addDocument', parentGroupId, function(document) {
                deferred.resolve(document);
            });
            return deferred.promise;
        };

        module.removeDocument = function(id) {
            socketService.emit('removeDocument', id);
        };

        module.moveDocument = function(id, oldParentId, newParentId) {
            var deferred = $q.defer();
            socketService.emit('moveItem', id, oldParentId, newParentId, function() {
                deferred.resolve();
            });
            return deferred.promise;
        };

        module.getDeletedItems = function(parentGroup) {
            var deferred = $q.defer();
            socketService.emit('getDeletedItems', parentGroup, function(items) {
                deferred.resolve(items);
            });
            return deferred.promise;
        };

        return module;
    }
}());
