require('raptor-polyfill/string/endsWith');
var nodePath = require('path');
var Module = require('module').Module;
var util = require('../../util')
var sep = nodePath.sep;

function find(path, from, callback, thisObj) {
    if (util.isAbsolute(path)) {
        return callback.call(thisObj, path);
    }

    if (path.charAt(0) === '.') {
        // Don't go through the search paths for relative paths
        var joined = callback.call(thisObj, nodePath.join(from, path));
        if (joined && joined.endsWith(sep)) {
            joined = joined.slice(0, -1);
        }
        return joined;
    } else {
        var paths = Module._nodeModulePaths(from);

        for (var i=0, len=paths.length; i<len; i++) {
            var searchPath = paths[i];
            if (!util.cachingFs.isDirectorySync(searchPath)) {
                continue;
            }

            var result = callback.call(thisObj, nodePath.join(searchPath, path));
            if (result) {
                return result;
            }
        }
    }
}

exports.find = find;