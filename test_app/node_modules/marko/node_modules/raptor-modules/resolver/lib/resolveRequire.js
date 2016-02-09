var ok = require('assert').ok;
var nodePath = require('path');
var searchPath = require('./search-path');
var moduleUtil = require('../../util');
var cachingFs = moduleUtil.cachingFs;

function getParentModuleLogicalPath(path) {
    var lastDollar = path.lastIndexOf('$');
    if (lastDollar === -1) {
        return '';
    } else {
        var parentModuleNameEnd = path.indexOf('/', lastDollar+2);
        if (parentModuleNameEnd === -1) {
            parentModuleNameEnd = path.length;
        }

        return path.substring(0, parentModuleNameEnd);
    }
}

/**
 * @param {String} target the path being required (can be relative path, absolute path, or module name)
 * @param {String} from the path from which the target is being required
 *      (this is used to assist with module resolution and making relative paths absolute)
 * @param {Boolean} options.removeExt remove extension? (optional, default: true)
 * @param {String} options.root the project root directory (optional, default: getProjectRootDir(from))
 * @param {Object} options.remap additional remapping rules (optional)
 * @param {Boolean} options.makeRoot a linked in module (via "npm link <modulename>")
 *      will be external to project but we can force these to be resolved as if they are in project
 *
 * @return {Object} object with these properties
 *      - filePath
 *      - logicalPath
 *      - realPath
 *      - isDir
 *      - isBrowserOverride
 *      - remap
 *      - main
 */
function resolveRequire(target, from, options) {
    ok(target, '"target" is required');
    ok(typeof target === 'string', '"target" must be a string');
    ok(from, '"from" is required');
    ok(typeof from === 'string', '"from" must be a string');

    var resolvedPath;

    if (target.charAt(0) === '/' || target.indexOf(':\\') !== -1) {
        var stat = cachingFs.statSync(target);
        if (stat.exists()) {
            resolvedPath = target;

            // We need "from" to be accurate for looking up browser overrides:
            from = stat.isDirectory() ? resolvedPath : nodePath.dirname(resolvedPath);
        }
    }

    if (!resolvedPath) {
        var browserOverrides;

        // If target does not start with "." or "/" then we assume
        // that the target is a module name and we check to see if
        // we need to remap the module name if browser overrides
        // exist.
        if (/^[^\.\/]/.test(target) && (browserOverrides = moduleUtil.getBrowserOverrides(from))) {
            // This top-level module might be mapped to a completely different module
            // based on the module metadata in package.json
            var remappedModule = browserOverrides.getRemappedModuleInfo(target, from);
            if (remappedModule) {
                if (remappedModule.name) {
                    var browserOverride = resolveRequire(remappedModule.name, remappedModule.from, options);
                    browserOverride.dep.childName = target;
                    browserOverride.dep.remap = remappedModule.name;
                    browserOverride.isBrowserOverride = true;
                    return browserOverride;
                } else if (remappedModule.filePath) {
                    // We are in a situation where an installed module is remapped to a local file
                    var fromPathInfo = moduleUtil.getPathInfo(from, options);
                    var overridePathInfo = moduleUtil.getPathInfo(remappedModule.filePath, options);

                    var parentPath = getParentModuleLogicalPath(fromPathInfo.logicalPath);

                    // We need to calculate a relative path from the root of the module
                    // to the nested module
                    var relPath = parentPath === '' ?
                        '.' + overridePathInfo.logicalPath :
                        nodePath.relative(parentPath, overridePathInfo.logicalPath);

                    // Make sure the path always starts with './' to indicate that it is relative
                    if (relPath.charAt(0) !== '.') {
                        relPath = './' + relPath;
                    }

                    // Since the user is trying to require an installed module we will add a
                    // dep that remaps to the calculated child path that will be considered relative
                    // to the root of the containing module

                    overridePathInfo.dep = {
                        parentPath: parentPath,
                        childName: target,
                        childVersion: null,
                        remap: relPath
                    };

                    overridePathInfo.isBrowserOverride = true;

                    return overridePathInfo;
                } else {
                    throw new Error('Illegal state');
                }
            }
        }

        var hasExt = nodePath.extname(target) !== '';

        resolvedPath = searchPath.find(target, from, function(path) {

            var dirname = nodePath.dirname(path);

            if (nodePath.basename(dirname) !== 'node_modules' && cachingFs.isDirectorySync(dirname)) {

                if (hasExt) {
                    if (cachingFs.existsSync(path)) {
                        return path;
                    }
                }

                // Try with the extensions
                var extensions = require.extensions;
                for (var ext in extensions) {
                    if (extensions.hasOwnProperty(ext) && ext !== '.node') {
                        var pathWithExt = path + ext;

                        if (cachingFs.existsSync(pathWithExt)) {
                            return pathWithExt;
                        }
                    }
                }
            }

            if (cachingFs.existsSync(path)) {
                return path;
            }

            return null;
        });
    }

    if (resolvedPath) {
        var pathInfo = moduleUtil.getPathInfo(resolvedPath, options);
        return pathInfo;
    } else {
        var e = new Error('Module not found: ' + target + ' (from: ' + from + ')');
        e.moduleNotFound = true;
        throw e;
    }
}

module.exports = resolveRequire;