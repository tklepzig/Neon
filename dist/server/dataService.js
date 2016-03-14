'use strict';

//config:
// remoteUrl
// username
// password
// repoPath
// dataFilename
// isPushAllowed
module.exports = function(config) {
    var module = {};

    var path = require('path');
    var uuid = require('node-uuid');

    var cache = null;
    var dataPath = path.join(config.repoPath, config.dataFilename);
    var file = require('./file.js')();
    var directory = require('./directory.js')();
    var repo = require('./repoService.js')({
        remoteUrl: config.remoteUrl,
        localPath: config.repoPath,
        username: config.username,
        password: config.password,
        author: 'neon',
        authorEmail: 'neon@neon'
    });

    var persistenceJobCounter = 0;
    var persistenceJob = function() {
        //every 10 seconds
        if (existChanges()) {
            file.write(dataPath, JSON.stringify(cache));
        }
        if (++persistenceJobCounter === 30) {
            persistenceJobCounter = 0;
            //every 5 miutes (30*10 seconds)
            repo.status().then(function(status) {
                if (status.length > 0) {
                    repo.commitFile(dataPath, 'neon change').then(function() {
                        //commit done
                        console.log('Committed!');
                        if (config.isPushAllowed) {
                            console.log('start push');
                            return repo.push();
                        }
                    }).then(function() {
                        //TODO: is this called when push is not allowed -> yes... :(
                        console.log('Pushed!');
                        //push done
                    }).catch(function(error) {
                        //something went wrong
                        console.log('Error: ' + error);
                    });
                }
            });
        }
    };

    function existChanges() {
        if (cache === null) {
            return false;
        }
        if (!file.exist(dataPath)) {
            return true;
        }

        var data = file.read(dataPath);
        return data !== JSON.stringify(cache);
    }

    function getData() {
        if (cache === null) {
            if (file.exist(dataPath)) {
                var data = file.read(dataPath);
                cache = JSON.parse(data);
            } else {
                cache = {};
            }
        }

        return cache;
    }



    module.initialize = function() {
        if (!directory.exist(config.repoPath)) {
            repo.clone().then(function() {
                setInterval(persistenceJob, 10000);
            });
        } else {
            //write every 10 seconds to file
            //commit and push every 5 minutes
            setInterval(persistenceJob, 10000);
        }
    };

    module.addDocument = function() {
        var id = uuid.v4();
        var document = {
            name: '',
            text: '',
            id: id
        };
        getData()[id] = document;

        return document;
    };

    module.removeDocument = function(id) {
        delete getData()[id];
    };

    module.updateDocument = function(document) {
        var doc = getData()[document.id];
        doc.text = document.text.replace(/\r?\n/g, '\r\n');
        doc.name = document.name;
    };

    module.getDocument = function(id) {
        //TODO: error handling
        return getData()[id];
    };

    module.getDocuments = function() {
        var data = getData();
        var docs = [];

        for (var documentId in data) {
            docs.push(data[documentId]);
        }

        return docs;
    };


    return module;
};
