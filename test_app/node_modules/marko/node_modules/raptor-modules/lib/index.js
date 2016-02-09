var nodePath = require('path');
var fs = require('fs');
var appModulePath = require('app-module-path');

function findRootPackage(dirname) {
    if (dirname === '' || dirname === '/') {
        return null;
    }

    var packagePath = nodePath.join(dirname, 'package.json');
    if (fs.existsSync(packagePath)) {
        var json = fs.readFileSync(packagePath, {encoding: 'utf8'});
        return JSON.parse(json);
    }

    var parentDirname = nodePath.dirname(dirname);
    if (parentDirname !== dirname) {
        return findRootPackage(parentDirname);
    }
    else {
        return null;
    }
}


function enableAppPaths(module) {
    var filename = module.filename;
    var dirname = nodePath.dirname(filename);
    var pkg = findRootPackage(dirname);
    if (!pkg) {
        throw new Error('Root package not found searching from "' + dirname + '"');
    }

    if (pkg['raptor-modules'] && pkg['raptor-modules'].paths) {
        var paths = pkg['raptor-modules'].paths;
        paths.forEach(function(path) {
            appModulePath.addPath(path);
        });
    }
    else {
        throw new Error('Root package does not a "raptor-modules.paths" property');
    }
}

exports.enableAppPaths = enableAppPaths;