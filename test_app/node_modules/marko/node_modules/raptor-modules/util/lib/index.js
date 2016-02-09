function removeExt(path) {
    var lastDot = path.lastIndexOf('.');
    if (lastDot !== -1) {
        return path.substring(0, lastDot);
    }
    else {
        return path;
    }
}

exports.cachingFs = require('./caching-fs');
exports.removeExt = removeExt;
exports.tryPackage = require('./package-reader').tryPackage;
exports.findMain = require('./findMain');
exports.getProjectRootDir = require('./getProjectRootDir');
exports.getModuleRootPackage = require('./getModuleRootPackage');
exports.getModuleRootDir = require('./getModuleRootDir');
exports.getBrowserOverrides = require('./browser-overrides').getBrowserOverrides;
exports.getPathInfo = require('./getPathInfo');
exports.isAbsolute = require('./path').isAbsolute;