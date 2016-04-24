(function() {
    'use strict';

    angular.module('socketService', [])
        .factory('socketService', socketService);

    function socketService(socketFactory) {
        var myIoSocket = io.connect();
        var mySocket = socketFactory({
            ioSocket: myIoSocket
        });

        mySocket.isConnected = function() {
            return myIoSocket.connected;
        };

        mySocket.reconnect = function() {
            myIoSocket = io.connect(undefined, {
                'force new connection': true
            });
        };

        return mySocket;
    }
}());
