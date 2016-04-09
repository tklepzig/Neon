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
var http = require('http').Server(app);
var socketIo = require('socket.io')(http);
var nconf = require('nconf');
require('colors');

var config = require('./config.json')[process.env.NODE_ENV || 'production'];
nconf.file(path.resolve(__dirname + '/secrets.json')).env();
var secrets = {
    repoUrl: nconf.get('repoUrl'),
    repoUser: nconf.get('repoUser'),
    repoPassword: nconf.get('repoPassword')
};
var dataService = require('./dataService.js')({
    repoPath: path.resolve(__dirname + config.repoPath),
    dataFilename: 'data-new.json',
    isPushAllowed: config.isPushAllowed,
    remoteUrl: secrets.repoUrl,
    username: secrets.repoUser,
    password: secrets.repoPassword
});
var port = process.env.PORT || config.port;

if (process.env.NODE_ENV === 'development') {
    console.log('Configuration: ' + 'development'.bold.green);
} else {
    console.log('Configuration: ' + (process.env.NODE_ENV || 'production').bold.red);
}

console.log('using ' + config.publicFilePath + ' to serve public files');
console.log('Push is ' + (config.isPushAllowed ? 'enabled'.bold.red : 'disabled'.bold.green));

app.use(express.static(path.resolve(__dirname + config.publicFilePath)));
app.get('/*', function(req, res) {
    res.sendFile(path.resolve(__dirname + config.publicFilePath + '/index.html'));
});

dataService.initialize();

socketIo.on('connection', function(socket) {
    var clientIp = socket.request.connection.remoteAddress;
    console.log('Client connected:\t' + clientIp);
    socket.on('disconnect', function() {
        console.log('Client disconnected:\t' + clientIp);
    });


    //client functions
    socket.on('getAllDocuments', function(callback) {
        callback(dataService.getRoot());
    });

    socket.on('updateGroup', function(group) {
        dataService.updateGroup(group);
        socket.broadcast.emit('groupUpdated', group);
    });

    socket.on('updateDocument', function(document) {
        dataService.updateDocument(document);
        socket.broadcast.emit('documentUpdated', document);
    });

    socket.on('addGroup', function(parentGroupId, callback) {
        var group = dataService.addGroup(parentGroupId);
        socket.broadcast.emit('groupAdded', group);
        callback(group);
    });

    socket.on('addDocument', function(parentGroupId, callback) {
        var document = dataService.addDocument(parentGroupId);
        socket.broadcast.emit('documentAdded', document);
        callback(document);
    });

    socket.on('removeGroup', function(id) {
        dataService.removeGroup(id);
        socket.broadcast.emit('groupRemoved', id);
    });

    socket.on('removeDocument', function(id) {
        dataService.removeDocument(id);
        socket.broadcast.emit('documentRemoved', id);
    });

    socket.on('getGroup', function(id, callback) {
        var group = dataService.getGroup(id);
        callback(group);
    });

    socket.on('getDocument', function(id, callback) {
        var document = dataService.getDocument(id);
        callback(document);
    });
});

http.listen(port, function() {
    console.log('listening on *:' + port);
});

module.exports = app;
