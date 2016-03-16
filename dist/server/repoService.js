'use strict';

module.exports = function(config) {

    var module = {};

    var git = require('nodegit');
    var path = require('path');

    module.clone = function() {
        return git.Clone(config.remoteUrl, config.localPath, {
            fetchOpts: {
                callbacks: {
                    credentials: function() {
                        return git.Cred.userpassPlaintextNew(config.username, config.password);
                    }
                }
            }
        });
    };

    module.status = function() {
        return git.Repository.open(config.localPath)
            .then(function(repo) {
                return repo.getStatus();
            });
    };

    module.push = function() {
        var repo;

        return git.Repository.open(config.localPath)
            .then(function(r) {
                repo = r;
                return repo.getRemote('origin');
            }).then(function(remote) {
                return remote.push(['refs/heads/master:refs/heads/master'], {
                    callbacks: {
                        credentials: function() {
                            return git.Cred.userpassPlaintextNew(config.username, config.password);
                        }
                    }
                });
            }).then(function() {
                // console.log('remote Pushed!');
            })
            .catch(function(reason) {
                console.log(reason);
            });
    };

    module.commitFile = function(filePath, commitMsg) {
        var repo, oid;

        return git.Repository.open(config.localPath)
            .then(function(r) {
                repo = r;
                return repo.openIndex();
            })
            .then(function(index) {
                console.log('filePath before replace: ' + filePath);

                filePath = filePath.replace(config.localPath, '');
                if (filePath.charAt(0) === path.sep) {
                    filePath = filePath.substr(1);
                }

                console.log('add file to git repo: ' + filePath);

                index.addByPath(filePath);
                index.write();
                return index.writeTree();
            }).then(function(oidResult) {
                oid = oidResult;
                return git.Reference.nameToId(repo, 'HEAD');
            }).then(function(head) {
                return repo.getCommit(head);
            }).then(function(parent) {
                var author = git.Signature.now(config.author, config.authorEmail);
                return repo.createCommit('HEAD', author, author, commitMsg, oid, [parent]);
            }).then(function(commitId) {
                // return console.log('New Commit: ', commitId);
            })
            .catch(function(reason) {
                console.log(reason);
            });
    };

    return module;
};
