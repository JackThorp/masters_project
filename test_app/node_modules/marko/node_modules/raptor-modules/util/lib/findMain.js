var fs = require('fs');
var cachingFs = require('./caching-fs');

var nodePath = require('path');
var packageReader = require('./package-reader');
var ok = require('assert').ok;

function findMainForFilename(dir, main) {
    var filenames = fs.readdirSync(dir);
    for (var i=0, len=filenames.length; i<len; i++) {
        var curFilename = filenames[i];
        var lastDot = curFilename.lastIndexOf('.');
        if (lastDot === -1) {
            lastDot = curFilename.length;
        }

        if (curFilename.substring(0, lastDot) === main) {
            var ext = curFilename.substring(lastDot);
            var handler = require.extensions[ext];
            if (handler) {
                return nodePath.join(dir, curFilename);
            }
        }
    }

    return null;
}

function findMain(path) {
    ok(typeof path === 'string', 'path should be a string');

    var packagePath = nodePath.join(path, 'package.json');
    var main;
    var pkg = packageReader.tryPackage(packagePath);
    if (pkg) {
        main = pkg.main;
    }

    if (!main) {
        main = findMainForFilename(path, 'index');
    } else {

        main = nodePath.resolve(path, main);
        var stat = cachingFs.statSync(main);

        if (!stat.exists() || stat.isDirectory()) {
            var dirname = nodePath.dirname(main);
            var filename = nodePath.basename(main);

            // The main file might be lacking a file extension
            main = findMainForFilename(dirname, filename);
        }
    }

    return main;
}

module.exports = findMain;