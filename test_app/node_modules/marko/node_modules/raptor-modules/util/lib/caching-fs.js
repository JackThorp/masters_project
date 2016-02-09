var fs = require('fs');
var DataHolder = require('raptor-async/DataHolder');

var cache = {};

function Stat() {

}

Stat.prototype.isDirectory = function() {
    return (this._directory === true);
};

Stat.prototype.exists = function() {
    return (this._exists === true);
};

Stat.prototype.lastModified = function() {
    return this._lastModified;
};

function createStat(fsStat) {
    var stat = new Stat();
    if (fsStat) {
        stat._exists = true;
        stat._lastModified = fsStat.mtime ? fsStat.mtime.getTime() : -1;
        stat._directory = fsStat.isDirectory();
    } else {
        stat._exists = false;
    }

    return stat;
}

function stat(filePath, callback) {
    var dataHolder = cache[filePath];
    if (dataHolder === undefined) {
        cache[filePath] = dataHolder = new DataHolder();
        fs.stat(filePath, function(err, stat) {
            dataHolder.resolve(createStat(stat));
        });
    }

    dataHolder.done(callback);
}

function statSync(filePath, callback) {
    var dataHolder = cache[filePath];
    var stat;

    if ((dataHolder === undefined) || !dataHolder.isSettled()) {
        if (dataHolder === undefined) {
            cache[filePath] = dataHolder = new DataHolder();
        }

        try {
            stat = createStat(fs.statSync(filePath));
        } catch(err) {
            stat = createStat(null);
        }

        dataHolder.resolve(stat);
    } else {
        stat = dataHolder.data;
    }

    return stat;
}

exports.stat = stat;
exports.statSync = statSync;

exports.lastModified = function(filePath, callback) {
    stat(filePath, function(err, stat) {
        callback(null, stat.lastModified());
    });
};

exports.exists = function(filePath, callback) {
    stat(filePath, function(err, stat) {
        callback(null, stat.exists());
    });
};

exports.existsSync = function(filePath) {
    return statSync(filePath).exists();
};

exports.isDirectorySync = function(filePath) {
    return statSync(filePath).isDirectory();
};

exports.clear = function() {
    cache = {};
};