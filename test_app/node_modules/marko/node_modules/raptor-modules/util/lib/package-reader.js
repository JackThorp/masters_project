var nodePath = require('path');
var pkgCache = {};

function tryPackage(path) {
    var pkg = pkgCache[path];

    if (pkg !== undefined) {
        return pkg;
    }

    try {
        pkg = require(path);
        
        if (pkg.__filename && pkg.__filename !== path) {
            pkg = require('raptor-util').extend({}, pkg);
        }

        pkg.__filename = path;
        pkg.__dirname = nodePath.dirname(path);
        
        pkgCache[path] = pkg;
        return pkg;
    }
    catch(e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            pkgCache[path] = null;    
        }
        else {
            throw e;
        }
        
    }
}

exports.tryPackage = tryPackage;