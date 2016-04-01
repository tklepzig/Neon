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
                    repo.commitFile(dataPath, 'data changed').then(function() {
                        //commit done
                        if (config.isPushAllowed) {
                            return repo.push();
                        }
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

    module.addGroup = function(parentGroupId) {
        var id = uuid.v4();
        var group = {
            name: '',
            children: {},
            type: 'group',
            priority: 'none',
            tags: [],
            id: id
        };

        if (typeof parentGroupId !== 'undefined') {
            module.getGroup(parentGroupId).children[id] = group;
        } else {
            getData()[id] = group;
        }

        return group;
    };

    module.addDocument = function(parentGroupId) {
        var id = uuid.v4();
        var document = {
            name: '',
            text: '',
            type: 'document',
            priority: 'none',
            tags: [],
            id: id
        };

        if (typeof parentGroupId !== 'undefined') {
            module.getGroup(parentGroupId).children[id] = document;
        } else {
            getData()[id] = document;
        }

        return document;
    };

    module.removeDocument = function(id) {
        // delete getData()[id];
    };

    module.updateGroup = function(group) {
        var grp = module.getGroup(group.id);
        grp.name = group.name;
    };

    module.updateDocument = function(document) {
        var doc = module.getDocument(document.id);
        doc.text = document.text.replace(/\r?\n/g, '\r\n');
        doc.name = document.name;
    };

    module.getRoot = function() {
        var data = getData();
        var items = [];

        for (var id in data) {
            items.push(data[id]);
        }

        return items;
    };

    module.getGroup = function(groupId, parentGroup) {
        var parentChildren;

        if (typeof parentGroup === 'undefined') {
            parentGroup = parentChildren = getData();
        } else {
            parentChildren = parentGroup.children;
        }

        for (var id in parentChildren) {
            if (parentChildren.hasOwnProperty(id)) {

                if (parentChildren[id].type === 'group') {
                    if (id === groupId) {
                        return parentChildren[id];
                    } else {
                        var result = module.getGroup(groupId, parentChildren[id]);
                        if (typeof result !== 'undefined') {
                            return result;
                        }
                    }
                }
            }
        }
    };

    module.getDocument = function(documentId, parentGroup) {
        var parentChildren;

        if (typeof parentGroup === 'undefined') {
            parentGroup = parentChildren = getData();
        } else {
            parentChildren = parentGroup.children;
        }

        for (var id in parentChildren) {
            if (parentChildren.hasOwnProperty(id)) {

                if (parentChildren[id].type === 'document' && id === documentId) {
                    return parentChildren[id];
                } else if (parentChildren[id].type === 'group') {
                    var result = module.getDocument(documentId, parentChildren[id]);
                    if (typeof result !== 'undefined') {
                        return result;
                    }
                }
            }
        }
    };



    return module;
};
