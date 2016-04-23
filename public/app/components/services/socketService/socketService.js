(function() {
    'use strict';

    angular.module('socketService', [])
        .factory('socketService', socketService);

    function socketService(socketFactory) {
        //optionally with specific socket.io object:

        // var myIoSocket = io.connect();
        // var mySocket = socketFactory({
        //     ioSocket: myIoSocket
        // });
        //
        // //check if connected: myIoSocket.connected
        //
        // function reconnect() {
        //     myIoSocket = io.connect(undefined, {
        //         'force new connection': true
        //     });
        // }
        //
        // return mySocket;

        return socketFactory();
    }
}());
