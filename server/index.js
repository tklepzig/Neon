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

var express = require('express');
var app = express();
var fileInteraction = require('./fileInteraction.js');
var http = require('http').Server(app);
var socketIo = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res)
{
    res.sendFile(__dirname + '/public/index.html');
});

socketIo.on('connection', function (socket)
{
    var clientIp = socket.request.connection.remoteAddress;
    console.log('Client connected:\n\tID: ' + socket.id + '\n\tIP: ' + clientIp + '\n');
    socket.on('disconnect', function () { console.log('Client disconnected:\n\tID: ' + socket.id + '\n\tIP: ' + clientIp + '\n'); });


    //client functions
    socket.on('getDocuments', function (callback)
    {
        callback(fileInteraction.getDocuments());
    });

    socket.on('updateDocument', function (id, text)
    {
        fileInteraction.updateDocument(id, text);
        socket.broadcast.emit('documentUpdated', id, text);
    });

    socket.on('addDocument', function (name)
    {
        var id = fileInteraction.addDocument(name);
        socket.broadcast.emit('documentAdded', id);
    });

    socket.on('removeDocument', function (id)
    {
        fileInteraction.removeDocument(id);
        socket.broadcast.emit('documentRemoved', id);
    });

    socket.on('loadDocument', function (id, callback)
    {
        var document = fileInteraction.getDocument(id);
        callback(document);
    });
});

http.listen(51101, function ()
{
    console.log('listening on *:51101');
});

module.exports = app;
