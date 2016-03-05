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
var user = require('./user.json');
var bodyParser = require('body-parser');
var fs = require('fs');
var hasher = require('password-hash-and-salt');
var options = {
    key: fs.readFileSync(path.resolve(__dirname + '/key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname + '/cert.pem'))
};
var https = require('https').createServer(options, app);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ensureLogin = require('connect-ensure-login');
var expressSession = require('express-session');
var socketIo = require('socket.io')(https);

var config = require('./config.json')[process.env.NODE_ENV || 'production'];
var fileInteraction = require('./fileInteraction.js')(config.notesFilePath, config.archiveFilePath);
var port = process.env.PORT || config.port;
console.log('using ' + config.publicFilePath + ' to serve public files');



// hasher('/*password*/').hash(function(error, hash) {
//     if (error) {
//         console.log('Error: ' + error);
//     }
//     console.log(hash);
// });


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(expressSession({
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000 //unit is ms (24 hours)
    }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function(username, password, done) {
        hasher(password).verifyAgainst(user.password, function(error, verified) {
            if (error) {
                console.log('Error: ' + error);
                done(null, false);
            }
            if (username === user.username && verified) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(id, cb) {
    cb(null, user);
});


app.get('/login', function(req, res) {
    res.sendFile(path.resolve(__dirname + config.publicFilePath + '/login.html'));
});
app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout',
    function(req, res) {
        req.logout();
        res.redirect('/');
    });

app.use(ensureLogin.ensureLoggedIn(), express.static(path.resolve(__dirname + config.publicFilePath)));
app.get('/*', ensureLogin.ensureLoggedIn(), function(req, res) {
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

https.listen(port, function() {
    console.log('listening on *:' + port);
});

module.exports = app;
