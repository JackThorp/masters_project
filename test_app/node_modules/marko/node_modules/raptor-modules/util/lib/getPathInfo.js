require('raptor-polyfill/string/startsWith');
var nodePath = require('path');
var ok = require('assert').ok;

var raptorModulesUtil = require('../../util');
var cachingFs = raptorModulesUtil.cachingFs;
var raptorModulesResolver = require('../../resolver');
var getProjectRootDir = raptorModulesUtil.getProjectRootDir;
var getModuleRootPackage = raptorModulesUtil.getModuleRootPackage;
var findMain = raptorModulesUtil.findMain;
var getBrowserOverrides = require('./browser-overrides').getBrowserOverrides;
var sep = nodePath.sep;

function normalizeDepDirnames(path) {
    var parts = path.split(/[\\/]/);
    for (var i=0, len=parts.length; i<len; i++) {
        var part = parts[i];

        if (part === 'node_modules') {
            parts[i] = '$';
        } else {
            // Replacing "$" characters with a "!" is kind of a hack
            // but it works well enough. We just can't allow "$" in the
            // logical or real path since "$" has a special meaning
            // as a "node_modules" directory. This fixes the following
            // issue:
            // Fixes https://github.com/lasso-js/lasso-require/issues/13
            parts[i] = part.replace(/[$]/g, '!');
        }
    }

    return parts.join('/');
}

function removeRegisteredExt(path) {
    var basename = nodePath.basename(path);
    var ext = nodePath.extname(basename);

    if (ext === '.js' || ext === '.json' || ext === '.es6') {
        return path.slice(0, 0-ext.length);
    } else {
        return path;
    }
}

function getPathInfo(path, options) {
    ok(typeof path === 'string', 'path should be a string');
    options = options || {};
    var normalizedPath = nodePath.normalize(path);

    var removeExt = options.removeExt !== false;

    var root = options.root || getProjectRootDir(path);
    var additionalRemaps = options.remap;

    var lastNodeModules = normalizedPath.lastIndexOf('node_modules' + sep);
    var logicalPath;
    var realPath;
    var dep;
    var stat = cachingFs.statSync(normalizedPath);

    if (!stat.exists(normalizedPath)) {
        throw new Error('File does not exist: ' + normalizedPath);
    }

    var name;
    var version;
    var basePath;

    if (!options.makeRoot && normalizedPath.startsWith(nodePath.normalize(root))) {
        logicalPath = normalizeDepDirnames(path.substring(root.length));
        if (logicalPath === '') {
            logicalPath = '/';
        }

        if (lastNodeModules !== -1) {
            var nodeModulesDir = path.substring(0, lastNodeModules + ('node_modules' + sep).length);
            var pkg = getModuleRootPackage(path);
            name = pkg.name;
            version = pkg.version;

            var moduleNameEnd = nodeModulesDir.length + name.length;
            basePath = '/' + name + '@' + version;
            realPath = normalizeDepDirnames(basePath + path.substring(moduleNameEnd));

            dep = {
                parentPath: normalizeDepDirnames(nodePath.dirname(nodeModulesDir).substring(root.length)),
                childName: name,
                childVersion: version
            };
        } else {
            realPath = logicalPath;
        }
    } else {

        // The module must be linked in so treat it as a top-level installed
        // dependency since we have no way of knowing which dependency this module belongs to
        // based on the given path
        var moduleRootPkg = getModuleRootPackage(path);
        name = moduleRootPkg.name;
        version = moduleRootPkg.version;


        basePath = '/' + name + '@' + version;
        realPath = normalizeDepDirnames(basePath + path.substring(moduleRootPkg.__dirname.length));
        logicalPath = name + path.substring(moduleRootPkg.__dirname.length);

        dep = {
            parentPath: '',
            childName: name,
            childVersion: version
        };

        // console.log('RESOLVE LINKED MODULE: ', '\npath: ', path, '\nrealPath: ', realPath, '\nlogicalPath: ', logicalPath, '\ndep: ', dep, '\nmoduleRootPkg.__dirname: ', moduleRootPkg.__dirname);
    }

    if (sep !== '/') {
        realPath = realPath.replace(/[\\]/g, '/');
        logicalPath = logicalPath.replace(/[\\]/g, '/');
    }

    if (realPath.endsWith('/')) {
        realPath = realPath.slice(0, -1);
    }

    if (logicalPath.endsWith('/')) {
        logicalPath = logicalPath.slice(0, -1);
    }

    var isDir = stat.isDirectory();
    var main;
    var remap;

    if (isDir) {
        var mainFilePath = findMain(path);
        if (mainFilePath) {
            var mainRelPath = removeRegisteredExt(nodePath.relative(path, mainFilePath));

            if (sep !== '/') {
                mainRelPath = mainRelPath.replace(/[\\]/g, '/');
            }

            main = {
                filePath: mainFilePath,
                path: mainRelPath
            };
        }
    } else {
        var overridePathInfo;
        var remapTo;
        var targetFile = additionalRemaps && additionalRemaps[path];
        var dirname = nodePath.dirname(path);

        if (targetFile) {
            // First handle "remap" passed from the options
            ok(targetFile, 'targetFile is null');

            remapTo = normalizeDepDirnames(nodePath.relative(dirname, targetFile));

            if (sep !== '/') {
                remapTo = remapTo.replace(/[\\]/g, '/');
            }

            overridePathInfo = getPathInfo(targetFile, options);
            overridePathInfo.isBrowserOverride = true;
            overridePathInfo.remap = {
                from: realPath,
                to: removeExt ? removeRegisteredExt(remapTo) : remapTo
            };
            return overridePathInfo;
        }

        if (removeExt) {
            logicalPath = removeRegisteredExt(logicalPath);
            realPath = removeRegisteredExt(realPath);
        }

        var browserOverrides = getBrowserOverrides(dirname);
        if (browserOverrides) {
            var browserOverride = browserOverrides.getRemappedModuleInfo(path, options);
            if (browserOverride) {
                if (browserOverride.filePath) {
                    // looks like the file should be substituted with
                    // another file that is relative to the package.json
                    targetFile = browserOverride.filePath;
                } else if (browserOverride.name) {
                    // It looks like the user wants the path to resolve
                    // to another module...
                    // However, if module resolution doesn't work then we'll
                    // assume that the "module name" was actually a relative path.
                    ok(browserOverride.from, 'browserOverride.from expected');
                    try {
                        // first, try resolving as module...
                        var targetModule = raptorModulesResolver.resolveRequire(
                                // target:
                                browserOverride.name,
                                // from:
                                browserOverride.from);
                        ok(targetModule.main && targetModule.main.filePath, 'Invalid target module');
                        targetFile = targetModule.main.filePath;
                    } catch(e) {
                        // Doesn't look like the module existed so we'll assume that
                        // the "module name" is actually a relative path
                        targetFile = nodePath.join(browserOverride.from, browserOverride.name);
                    }

                } else {
                    throw new Error('Invalid browser override for "' + path + '": ' + require('util').inspect(path));
                }

                remapTo = normalizeDepDirnames(nodePath.relative(dirname, targetFile));

                remap = {
                    from: realPath,
                    to: removeExt ? removeRegisteredExt(remapTo) : remapTo
                };

                ok(targetFile, 'targetFile is null');

                overridePathInfo = getPathInfo(targetFile, options);
                overridePathInfo.isBrowserOverride = true;
                overridePathInfo.remap = remap;
                return overridePathInfo;
            }
        }
    }

    var result = {
        filePath: path,
        logicalPath: logicalPath || '/',
        realPath: realPath || '/',
        isDir: isDir
    };

    if (dep) {
        result.dep = dep;
    }

    if (main) {
        result.main = main;
    }

    return result;
}

module.exports = getPathInfo;
