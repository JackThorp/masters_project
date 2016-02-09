require('raptor-polyfill/string/startsWith');
var ok = require('assert').ok;
var nodePath = require('path');
var tryPackage = require('../../util').tryPackage;
var findMain = require('../../util').findMain;
var resolver = require('../../resolver');
var browserOverridesByDir = {};

function BrowserOverrides(dirname) {
    this.overrides = {};
    this.dirname = dirname;
    this.parent = null;
    this.resolveCache = {};
    this.targetCache = {};
}

BrowserOverrides.prototype = {
    load: function(pkg) {
        this.dirname = pkg.__dirname;
        var browser = pkg.browser || pkg.browserify;
        var extname;

        if (browser) {
            if (typeof browser === 'string') {


                var defaultMain = findMain(this.dirname);
                extname = nodePath.extname(browser);
                if (extname) {
                    // Avoid an infinite loop if the browser override has no effect
                    // (this was seen in some of the browserify packages)
                    var absolutePath = nodePath.join(this.dirname, browser);
                    if (absolutePath === defaultMain) {
                        return;
                    }
                }

                this.overrides[defaultMain] = browser;
            } else {
                for (var source in browser) {
                    if (browser.hasOwnProperty(source)) {
                        var resolvedSource = source;
                        var target = browser[source];

                        if (source.startsWith('./')) {
                            resolvedSource = nodePath.join(this.dirname, source);
                        }

                        this.overrides[resolvedSource] = target;
                    }
                }
            }
        }
    },

    getRemappedModuleInfo: function(requested, options) {

        // console.log(module.id, 'getRemappedModuleInfo', requested, new Error().stack);
        var targetModuleInfo = this.targetCache[requested];
        var target;

        if (targetModuleInfo === undefined) {
            // there is no cache entry for this request
            var current = this;

            while (current) {
                target = current.overrides[requested];
                if (target) {
                    // there is a browser override at this level
                    if (target.startsWith('.')) {
                        var resolved = resolver.resolveRequire(target, current.dirname, options);
                        targetModuleInfo = {
                            filePath: resolved.filePath
                        };
                    } else {
                        targetModuleInfo = {
                            name: target,
                            from: current.dirname
                        };
                    }
                    break;
                }

                // move up to parent project (if exists) which might have its own overrides
                current = current.parent;
            }

            this.targetCache[requested] = targetModuleInfo || null;
        }

        return targetModuleInfo;
    }
};

var getBrowserOverrides;

function loadBrowserOverridesHelper(dirname) {
    var packagePath = nodePath.join(dirname, 'package.json');
    var pkg = tryPackage(packagePath);
    var browserOverrides = new BrowserOverrides(dirname);

    if (pkg) {
        browserOverrides.load(pkg);
        if (pkg.name) {
            return browserOverrides;
        }
    }

    // We are not the root package so try moving up a directory
    // to attach a parent to these browser overrides
    var parentDirname = nodePath.dirname(dirname);
    if (parentDirname && parentDirname !== dirname) {
        browserOverrides.parent = getBrowserOverrides(parentDirname);
    }

    return browserOverrides;

}

getBrowserOverrides = function(dirname) {
    ok(dirname, '"dirname" is required');
    ok(typeof dirname === 'string', '"dirname" must be a string');

    var browserOverrides = browserOverridesByDir[dirname];

    if (browserOverrides === undefined) {
        browserOverrides = loadBrowserOverridesHelper(dirname);
        browserOverridesByDir[dirname] = browserOverrides;
    }

    return browserOverrides;
};

exports.getBrowserOverrides = getBrowserOverrides;