'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var dateFormat = require('dateformat');

var notesFilename = __dirname + '/notes.json';
var backupDir = __dirname + '/archive';

var cache = null;

var getUniqueId = function(prefix) {
    var d = new Date().getTime();
    d += (parseInt(Math.random() * 100)).toString();
    if (undefined === prefix) {
        prefix = 'uid-';
    }
    d = prefix + d;
    return d;
};

//write to file, every 10 seconds
setInterval(function() {
    if (existsChanges()) {
        fs.writeFileSync(notesFilename, JSON.stringify(cache));
    }

}, 10000);


//backup, every hour
setInterval(function() {
    var dateString = dateFormat(new Date(), 'yyyy-mm-dd_HH-MM');
    var file = path.join(backupDir, util.format('notes_%s.json', dateString));

    try {
        fs.mkdirSync(backupDir);
    } catch (ex) {
        if (ex.code !== 'EEXIST') { //throw all errors except 'directory exists already'
            throw ex;
        }
    }

    fs.writeFileSync(file, JSON.stringify(cache));

}, 60 * 60 * 1000);



function getData() {
    if (cache === null) {
        //DRY
        try {
            var data = fs.readFileSync(notesFilename, 'utf8');
            cache = JSON.parse(data);
        } catch (ex) {
            if (ex.code === 'ENOENT') { //file not found
                cache = {};
            } else {
                throw ex;
            }
        } finally {
            return cache;
        }
    } else {
        return cache;
    }
}

function existsChanges() {
    var notExisting = false;
    var data = null;
    
    //DRY
    try {
        data = fs.readFileSync(notesFilename, 'utf8');
    } catch (ex) {
        if (ex.code === 'ENOENT') { //file not found
            notExisting = true;
        } else {
            throw ex;
        }
    }

    return cache !== null && (data !== JSON.stringify(cache) || notExisting);
}

module.exports.addDocument = function(name) {
    var id = getUniqueId('doc-');
    getData()[id] = {
        name: name,
        text: '',
        id: id
    };

    return id;
};

module.exports.removeDocument = function(id) {
    delete getData()[id];
};

module.exports.updateDocument = function(id, text) {
    getData()[id].text = text.replace(/\r?\n/g, '\r\n');
};

module.exports.getDocument = function(id) {
    //TODO: error handling
    return getData()[id];
};

module.exports.getDocuments = function() {
    var data = getData();
    var docs = [];

    for (var documentId in data) {
        docs.push(data[documentId]);
    }

    return docs;
};
