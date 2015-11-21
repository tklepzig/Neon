'use strict';

/*

// send to current request socket client
 socket.emit('message', 'this is a test');

 // sending to all clients, include sender
 io.sockets.emit('message', 'this is a test');

 // sending to all clients except sender
 socket.broadcast.emit('message', 'this is a test');

 // sending to all clients in 'game' room(channel) except sender
 socket.broadcast.to('game').emit('message', 'nice game');

  // sending to all clients in 'game' room(channel), include sender
 io.sockets.in('game').emit('message', 'cool game');

 // sending to individual socketid
 io.sockets.socket(socketid).emit('message', 'for your eyes only');

*/

var path = require('path');
var express = require('express');
var app = express();
var fileInteraction = require('./fileInteraction.js');
var http = require('http').Server(app);
var socketIo = require('socket.io')(http);

var config = require('./config.json')[process.env.NODE_ENV || 'development'];
var port = process.env.PORT || config.port;
console.log('using ' + config.publicFilePath + ' to serve public files');

app.use(express.static(path.resolve(__dirname + config.publicFilePath)));
app.get('/*', function(req, res) {
    res.sendFile(path.resolve(__dirname + config.publicFilePath + '/index.html'));
});

socketIo.on('connection', function(socket) {
    var clientIp = socket.request.connection.remoteAddress;
    console.log('Client connected:\t' + clientIp);
    socket.on('disconnect', function() {
        console.log('Client disconnected:\t' + clientIp);
    });


    //client functions
    socket.on('getAllDocuments', function(callback) {
        callback(fileInteraction.getDocuments());
    });

    socket.on('updateDocument', function(document) {
        fileInteraction.updateDocument(document);
        socket.broadcast.emit('documentUpdated', document);
    });

    socket.on('addDocument', function(callback) {
        var document = fileInteraction.addDocument();
        socket.broadcast.emit('documentAdded', document);
        callback(document);
    });

    socket.on('removeDocument', function(id) {
        fileInteraction.removeDocument(id);
        socket.broadcast.emit('documentRemoved', id);
    });

    socket.on('getDocument', function(id, callback) {
        var document = fileInteraction.getDocument(id);
        callback(document);
    });
});

http.listen(port, function() {
    console.log('listening on *:' + port);
});

module.exports = app;
