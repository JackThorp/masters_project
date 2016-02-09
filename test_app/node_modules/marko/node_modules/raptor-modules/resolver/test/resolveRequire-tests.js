'use strict';
require('../'); // Load the module
var nodePath = require('path');
var chai = require('chai');
chai.Assertion.includeStack = true;
require('chai').should();
var expect = require('chai').expect;

require('../'); // Load this module just to make sure it works

describe('raptor-modules/resolver.resolveRequire' , function() {

    beforeEach(function(done) {
        for (var k in require.cache) {
            if (require.cache.hasOwnProperty(k)) {
                delete require.cache[k];
            }
        }
        done();
    });

    it('should resolve require correctly for top-level installed modules dirs', function() {
        require('app-module-path').addPath(nodePath.join(__dirname, 'test-project/src'));
        var resolver = require('../');
        var from = nodePath.join(__dirname, 'test-project');
        var pathInfo = resolver.resolveRequire('foo', from, {root: nodePath.join(__dirname, "test-project")});

        expect(pathInfo).to.deep.equal({
            logicalPath: '/$/foo',
            realPath: '/foo@1.0.0',
            main: {
                filePath: nodePath.join(__dirname, 'test-project/node_modules/foo/lib/index.js'),
                path: 'lib/index'
            },
            filePath: nodePath.join(__dirname, 'test-project/node_modules/foo'),
            isDir: true,
            dep: {
                parentPath: '',
                childName: 'foo',
                childVersion: '1.0.0'
            }
        });
    });

    it('should resolve require correctly for top-level installed module files', function() {
        require('app-module-path').addPath(nodePath.join(__dirname, 'test-project/src'));
        var resolver = require('../');
        var from = nodePath.join(__dirname, 'test-project');
        var pathInfo = resolver.resolveRequire('foo/lib/index', from, {root: nodePath.join(__dirname, "test-project")});
        expect(pathInfo).to.deep.equal({
            logicalPath: '/$/foo/lib/index',
            realPath: '/foo@1.0.0/lib/index',
            filePath: nodePath.join(__dirname, 'test-project/node_modules/foo/lib/index.js'),
            isDir: false,
            dep: {
                parentPath: '',
                childName: 'foo',
                childVersion: '1.0.0'
            }
        });
    });

    it('should resolve require correctly for relative paths', function() {
        require('app-module-path').addPath(nodePath.join(__dirname, 'test-project/src'));
        var resolver = require('../');
        var from = nodePath.join(__dirname, 'test-project/src');
        var pathInfo = resolver.resolveRequire('./hello-world', from, {root: nodePath.join(__dirname, "test-project")});
        expect(pathInfo).to.deep.equal({
            logicalPath: '/src/hello-world',
            realPath: '/src/hello-world',
            filePath: nodePath.join(__dirname, 'test-project/src/hello-world'),
            isDir: true,
            main: {
                filePath: nodePath.join(__dirname, 'test-project/src/hello-world/index.js'),
                path: 'index'
            }
        });
    });

    it('should resolve require correctly for "./"" relative paths', function() {
        require('app-module-path').addPath(nodePath.join(__dirname, 'test-project/src'));
        var resolver = require('../');
        var from = nodePath.join(__dirname, 'test-project/node_modules/foo/lib');
        var pathInfo = resolver.resolveRequire('./', from, {root: nodePath.join(__dirname, "test-project")});
        expect(pathInfo).to.deep.equal({
            logicalPath: '/$/foo/lib',
            realPath: '/foo@1.0.0/lib',
            filePath: nodePath.join(__dirname, 'test-project/node_modules/foo/lib'),
            isDir: true,
            dep: {
                parentPath: '',
                childName: 'foo',
                childVersion: '1.0.0',
            },
            main: {
                filePath: nodePath.join(__dirname, 'test-project/node_modules/foo/lib/index.js'),
                path: 'index'
            }
        });
    });

    it('should handle browser override for main script in a sub-module', function() {
        require('app-module-path').addPath(nodePath.join(__dirname, 'test-project/src'));
        var resolver = require('../');
        var from = nodePath.join(__dirname, 'test-project/src');
        var pathInfo = resolver.resolveRequire('browser-overrides/main/sub/sub', from, {root: nodePath.join(__dirname, "test-project")});
        expect(pathInfo).to.deep.equal({

            logicalPath: '/$/browser-overrides/main/sub/sub_browser',
            realPath: '/browser-overrides@0.0.0/main/sub/sub_browser',
            filePath: nodePath.join(__dirname, 'test-project/node_modules/browser-overrides/main/sub/sub_browser.js'),
            isDir: false,
            dep: {
                parentPath: '',
                childName: 'browser-overrides',
                childVersion: '0.0.0'
            },
            remap: {
                from: '/browser-overrides@0.0.0/main/sub/sub',
                to: 'sub_browser'
            },
            isBrowserOverride: true
        });
    });

    it('should handle browser files overrides for main script', function() {
        require('app-module-path').addPath(nodePath.join(__dirname, 'test-project/src'));
        var resolver = require('../');
        var from = nodePath.join(__dirname, 'test-project/src');
        var pathInfo = resolver.resolveRequire('browser-overrides/override-files', from, {root: nodePath.join(__dirname, "test-project")});
        expect(pathInfo).to.deep.equal({

            logicalPath: '/$/browser-overrides/override-files',
            realPath: '/browser-overrides@0.0.0/override-files',
            filePath: nodePath.join(__dirname, 'test-project/node_modules/browser-overrides/override-files'),
            isDir: true,
            dep: {
                parentPath: '',
                childName: 'browser-overrides',
                childVersion: '0.0.0'
            },
            main: {
                filePath: nodePath.join(__dirname, 'test-project/node_modules/browser-overrides/override-files/index.js'),
                path: 'index'
            }
        });
    });

    it('should handle browser files overrides for root file', function() {
        require('app-module-path').addPath(nodePath.join(__dirname, 'test-project/src'));
        var resolver = require('../');
        var from = nodePath.join(__dirname, 'test-project/src');
        var pathInfo = resolver.resolveRequire('browser-overrides/override-files/hello', from, {root: nodePath.join(__dirname, "test-project")});
        expect(pathInfo).to.deep.equal({

            logicalPath: '/$/browser-overrides/override-files/hello_browser',
            realPath: '/browser-overrides@0.0.0/override-files/hello_browser',
            filePath: nodePath.join(__dirname, 'test-project/node_modules/browser-overrides/override-files/hello_browser.js'),
            isDir: false,
            dep: {
                parentPath: '',
                childName: 'browser-overrides',
                childVersion: '0.0.0'
            },
            remap: {
                from: "/browser-overrides@0.0.0/override-files/hello",
                to: "hello_browser"
            },
            isBrowserOverride: true
        });
    });

    it('should handle browser files overrides for nested file', function() {
        require('app-module-path').addPath(nodePath.join(__dirname, 'test-project/src'));
        var resolver = require('../');
        var from = nodePath.join(__dirname, 'test-project/src');
        var pathInfo = resolver.resolveRequire('browser-overrides/override-files/hello/world', from, {root: nodePath.join(__dirname, "test-project")});
        expect(pathInfo).to.deep.equal({

            logicalPath: '/$/browser-overrides/override-files/hello/world_browser',
            realPath: '/browser-overrides@0.0.0/override-files/hello/world_browser',
            filePath: nodePath.join(__dirname, 'test-project/node_modules/browser-overrides/override-files/hello/world_browser.js'),
            isDir: false,
            dep: {
                parentPath: '',
                childName: 'browser-overrides',
                childVersion: '0.0.0'
            },
            remap: {
                from: '/browser-overrides@0.0.0/override-files/hello/world',
                to: 'world_browser',
            },
            isBrowserOverride: true
        });
    });

    it('should handle browser files overrides for file to module', function() {
        require('app-module-path').addPath(nodePath.join(__dirname, 'test-project/src'));
        var resolver = require('../');
        var from = nodePath.join(__dirname, 'test-project/browser-overrides/override-files');
        var pathInfo = resolver.resolveRequire('browser-overrides/override-files/hello-world', from, {root: nodePath.join(__dirname, "test-project")});
        expect(pathInfo).to.deep.equal({

            logicalPath: '/$/browser-overrides/$/hello-world-browserify/index',
            realPath: '/hello-world-browserify@9.9.9/index',
            filePath: nodePath.join(__dirname, 'test-project/node_modules/browser-overrides/node_modules/hello-world-browserify/index.js'),
            isDir: false,
            dep: {
                parentPath: '/$/browser-overrides',
                childName: 'hello-world-browserify',
                childVersion: '9.9.9'
            },
            remap: {
                from: '/browser-overrides@0.0.0/override-files/hello-world',
                to: '../$/hello-world-browserify/index'
            },
            isBrowserOverride: true
        });
    });

    it('should handle browser overrides for one module to another module', function() {
        require('app-module-path').addPath(nodePath.join(__dirname, 'test-project/src'));
        var resolver = require('../');
        var from = nodePath.join(__dirname, 'test-project/node_modules/browser-overrides/override-files');
        var pathInfo = resolver.resolveRequire('hello-world', from, {root: nodePath.join(__dirname, "test-project")});
        // console.log(JSON.stringify(pathInfo, null, '    '));
        expect(pathInfo).to.deep.equal({

            logicalPath: '/$/browser-overrides/$/hello-world-browserify',
            realPath: '/hello-world-browserify@9.9.9',
            filePath: nodePath.join(__dirname, 'test-project/node_modules/browser-overrides/node_modules/hello-world-browserify'),
            isDir: true,
            main: {
                filePath: nodePath.join(__dirname, 'test-project/node_modules/browser-overrides/node_modules/hello-world-browserify/index.js'),
                path: 'index'
            },
            dep: {
                parentPath: '/$/browser-overrides',
                childName: 'hello-world',
                childVersion: '9.9.9',
                remap: 'hello-world-browserify'
            },
            isBrowserOverride: true
        });
    });

    it('should handle module not found', function() {
        require('app-module-path').addPath(nodePath.join(__dirname, 'test-project/src'));
        var resolver = require('../');
        var from = nodePath.join(__dirname, 'test-project/node_modules/bar');
        var e = null;
        try {
            resolver.resolveRequire('hello-world', from, {root: nodePath.join(__dirname, "test-project")});
        }
        catch(_e) {
            e = _e;
        }
        expect(e).to.not.equal(null);
    });

    it('should resolve a module with main as a directory and file with the same name', function() {
        var resolver = require('../');
        var target = 'jsdom';
        var from = nodePath.join(__dirname, 'test-project/node_modules/jquery/lib');
        var root = nodePath.join(__dirname, 'test-project');

        var resolved = resolver.resolveRequire(target, from, {root: root});
        // console.log(JSON.stringify(resolved, null ,4));
        expect(/\.js$/.test(resolved.main.filePath)).to.equal(true);

    });

    it('should resolve a module with main as a directory and file with the same name', function() {
        var resolver = require('../');
        var target = 'baz';
        var from = nodePath.join(__dirname, 'test-project');
        var root = nodePath.join(__dirname, 'test-project');
        var resolved = resolver.resolveRequire(target, from, {root: root});
        // console.log(JSON.stringify(resolved, null ,4));
        expect(resolved).to.deep.equal({

            logicalPath: '/baz-shim',
            realPath: '/baz-shim',
            filePath: nodePath.join(__dirname, 'test-project/baz-shim.js'),
            isDir: false,
            dep: {
                parentPath: '',
                childName: 'baz',
                childVersion: null,
                remap: './baz-shim'
            },
            isBrowserOverride: true
        });

    });

    it('should handle browser file overrides in form "browser": "index-browser.js"', function() {
        /*
         * This test was added to make sure we support package.json that looks
         * something like this:
         * {
         *     "name": "test-project",
         *     "version": "0.0.0",
         *     "main": "index.js",
         *     "browser": "index-browser.js"
         * }
         *
         * In this example, the "browser" property looks like a module
         * name so we need to try resolving it as a module and then
         * as a relative path if module resolution failed
         * (this is done to be consistent with browserify)
         */
        var resolver = require('../');

        var fromDir = nodePath.join(__dirname, 'test-project-index-browser');
        var pathInfo = resolver.resolveRequire('./index.js', fromDir, {
            root: nodePath.join(__dirname, "test-project-index-browser")
        });

        expect(pathInfo).to.deep.equal({
            filePath: nodePath.join(__dirname, 'test-project-index-browser/index-browser.js'),
            logicalPath: '/index-browser',
            realPath: '/index-browser',
            isDir: false,
            isBrowserOverride: true,
            remap: {
                from: "/index",
                to: "index-browser"
            }
        });
    });

});

