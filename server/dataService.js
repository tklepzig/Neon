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


    function getAllGroups(excludeGroupIds, parentGroup, groups) {
        var parentChildren;

        if (typeof groups === 'undefined') {
            groups = [];
        }

        if (typeof parentGroup === 'undefined') {
            parentGroup = parentChildren = getData();
        } else {
            parentChildren = parentGroup.children;
        }

        for (var id in parentChildren) {
            if (parentChildren.hasOwnProperty(id)) {
                if (parentChildren[id].type === 'group' && excludeGroupIds.indexOf(id) === -1) {
                    groups.push(parentChildren[id]);
                    getAllGroups(excludeGroupIds, parentChildren[id], groups);
                }
            }
        }

        return groups;
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

        if (typeof parentGroupId !== 'undefined' && parentGroupId !== null) {
            module.getGroup(parentGroupId).group.children[id] = group;
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

        if (typeof parentGroupId !== 'undefined' && parentGroupId !== null) {
            module.getGroup(parentGroupId).group.children[id] = document;
        } else {
            getData()[id] = document;
        }

        return document;
    };

    module.moveItem = function(id, oldParentId, newParentId) {

        if (typeof oldParentId === 'undefined' || oldParentId === null) {
            oldParentId = null;
        }

        if (typeof newParentId === 'undefined' || newParentId === null) {
            newParentId = null;
        }

        if (oldParentId === newParentId || (oldParentId === null && newParentId === null)) {
            //old and new are equal, so do nothing
            return;
        }

        var oldParent;
        var newParent;

        if (oldParentId === null) {
            oldParent = getData();
        } else {
            oldParent = module.getGroup(oldParentId).group.children;
        }
        if (newParentId === null) {
            newParent = getData();
        } else {
            newParent = module.getGroup(newParentId).group.children;
        }

        newParent[id] = oldParent[id];
        delete oldParent[id];
    };

    module.removeGroup = function(id) {
        var group = module.getGroup(id).group;
        group.deleted = true;
        // if (typeof group.metadata.parentId === 'undefined') {
        //     delete getData()[id];
        // } else {
        //     var parentGroup = module.getGroup(group.metadata.parentId);
        //     delete parentGroup.group.children[id];
        // }
    };

    module.removeDocument = function(id) {
        var document = module.getDocument(id).document;
        document.deleted = true;
        // if (typeof document.metadata.parentId === 'undefined') {
        //     delete getData()[id];
        // } else {
        //     var parentGroup = module.getGroup(document.metadata.parentId);
        //     delete parentGroup.group.children[id];
        // }
    };

    module.updateGroup = function(group) {
        var grp = module.getGroup(group.id).group;
        grp.name = group.name;
        grp.priority = group.priority;
    };

    module.updateDocument = function(document) {
        var doc = module.getDocument(document.id).document;
        doc.text = document.text.replace(/\r?\n/g, '\r\n');
        doc.name = document.name;
        doc.priority = document.priority;
    };

    module.getRoot = function() {
        // var data = getData();
        // var items = [];
        //
        // for (var id in data) {
        //     items.push(data[id]);
        // }

        return getData();
    };

    module.getMoveToGroups = function(item, parentId) {
        if (item.type === 'document') {
            //get all groups excluding the document's parent
            return getAllGroups([parentId]);
        } else if (item.type === 'group') {
            //get all groups excluding the group's parent
            //exclude the item itself and all of its children
            return getAllGroups([parentId, item.id]);
        }
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
                        return {
                            group: parentChildren[id],
                            metadata: {
                                parentId: parentGroup.id
                            }
                        };
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
                    return {
                        document: parentChildren[id],
                        metadata: {
                            parentId: parentGroup.id
                        }
                    };
                } else if (parentChildren[id].type === 'group') {
                    var result = module.getDocument(documentId, parentChildren[id]);
                    if (typeof result !== 'undefined') {
                        return result;
                    }
                }
            }
        }
    };


    module.migrate = function(parentGroup) {
        if (typeof parentGroup === 'undefined') {
            parentGroup = getData();
        }

        for (var id in parentGroup) {
            if (parentGroup.hasOwnProperty(id)) {
                if (parentGroup[id].type === 'group') {
                    //add new properties to group
                    // parentGroup[id].lastModified = new Date();

                    module.migrate(parentGroup[id].children);
                } else if (parentGroup[id].type === 'document') {
                    //add new properties to document
                    // parentGroup[id].lastModified = new Date();
                }
            }
        }
    };

    return module;
};
