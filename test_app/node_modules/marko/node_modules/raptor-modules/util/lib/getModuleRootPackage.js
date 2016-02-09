var nodePath = require('path');
var packageReader = require('./package-reader');

var cachedModuleRootPackages = {};


function findRootPackageHelper(dirname) {
    if (dirname === '' || dirname === '/') {
        return null;
    }

    var packagePath = nodePath.join(dirname, 'package.json');
    var pkg = packageReader.tryPackage(packagePath);
    if (pkg && pkg.name) {
        // Only consider packages that have a name to avoid
        // intermediate packages that might only be used to
        // define a main script
        return pkg;    
    }

    var parentDirname = nodePath.dirname(dirname);
    if (parentDirname !== dirname) {
        return findRootPackageHelper(parentDirname);
    }
    else {
        return null;
    }
}

function getModuleRootPackage(dirname) {

    var rootPkg = cachedModuleRootPackages[dirname];
    if (rootPkg) {
        return rootPkg;
    }


    rootPkg = findRootPackageHelper(dirname);
    if (!rootPkg) {
        throw new Error('Unable to determine module root for path "' + dirname + '"');
    }

    cachedModuleRootPackages[dirname] = rootPkg;

    return rootPkg;
}

module.exports = getModuleRootPackage;