require('raptor-polyfill/string/startsWith');

var nodePath = require('path');
var packageReader = require('./package-reader');
var cwd = process.cwd();
var cachedModuleRootDirs = {};


function findRootDirHelper(dirname) {
    if (dirname === '' || dirname === '/') {
        return null;
    }

    var parentDirname = nodePath.dirname(dirname);

    if (nodePath.basename(parentDirname) === 'node_modules') {
        return dirname;
    }

    var packagePath = nodePath.join(dirname, 'package.json');
    var pkg = packageReader.tryPackage(packagePath);
    if (pkg && pkg.name) {
        // Only consider packages that have a name to avoid
        // intermediate packages that might only be used to
        // define a main script
        return dirname;    
    }

    
    if (parentDirname !== dirname) {
        return findRootDirHelper(parentDirname);
    }
    else {
        return null;
    }
}

function getModuleRootDir(dirname) {

    var rootDir = cachedModuleRootDirs[dirname];
    if (rootDir) {
        return rootDir;
    }


    rootDir = findRootDirHelper(dirname);
    if (!rootDir) {
        if (dirname.startsWith(cwd)) {
            rootDir = cwd;
        } else {
            throw new Error('Unable to determine module root for path "' + dirname + '"');    
        }
    }

    cachedModuleRootDirs[dirname] = rootDir;

    return rootDir;
}

module.exports = getModuleRootDir;