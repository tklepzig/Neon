(function() {
    'use strict';

    angular.module('documentService', ['socketService'])
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
        
        return module;
    }
}());
