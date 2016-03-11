'use strict';

//config:
// repoPath
// dataFilename
module.exports = function(config) {
    var module = {};

    var path = require('path');
    var fs = require('fs');
    var uuid = require('node-uuid');

    var cache = null;
    var dataPath = path.join(config.repoPath, config.dataFilename);
    var repo = require('repoService')({
        remoteUrl: '',
        localPath: config.repoPath,
        username: '',
        password: '',
        author: '',
        authorEmail: ''
    });

    function existsFile(file) {
        try {
            fs.statSync(file);
            return true;
        } catch (ex) {
            if (ex.code === 'ENOENT') { //file not found
                return false;
            } else {
                throw ex;
            }
        }
    }

    function existsDirectory(directory) {
        try {
            fs.statSync(directory).isDirectory();
            return true;
        } catch (ex) {
            if (ex.code === 'ENOENT') { //file not found
                return false;
            } else {
                throw ex;
            }
        }
    }

    //write to file, every 30 seconds
    setInterval(function() {
        if (existsChanges()) {
            fs.writeFileSync(dataPath, JSON.stringify(cache));
        }
    }, 10000);

    //commit and push, every 5 minutes
    setInterval(function() {
        if (existsChanges()) {
            fs.writeFileSync(dataPath, JSON.stringify(cache));
            repo.commitFile(dataPath).then(function() {
                //commit done
                if (pushAllowed) {
                    return repo.push();
                }
            }).then(function() {
                //TODO: is this called when push is not allowed?

                //push done
            }).catch(function(error) {
                //something went wrong
            });
        }
    }, 5 * 60 * 1000);


    function existsChanges() {
        if (!existsFile(dataPath)) {
            return true;
        } else {
            var data = fs.readFileSync(dataPath, 'utf8');
            return cache !== null && data !== JSON.stringify(cache);
        }
    }

    function getData() {
        if (cache === null) {
            if (existsFile(dataPath)) {
                var data = fs.readFileSync(dataPath, 'utf8');
                cache = JSON.parse(data);
            } else {
                cache = {};
            }
        }

        return cache;
    }



    module.initialize = function() {
        if (!existsDirectory(config.repoPath)) {
            repo.clone();
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
