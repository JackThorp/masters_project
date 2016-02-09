'use strict';
require('../'); // Load the module
var nodePath = require('path');
var chai = require('chai');
chai.Assertion.includeStack = true;
require('chai').should();
var expect = require('chai').expect;

require('../'); // Load this module just to make sure it works

describe('raptor-modules/util.getPathInfo' , function() {

    beforeEach(function(done) {
        for (var k in require.cache) {
            if (require.cache.hasOwnProperty(k)) {
                delete require.cache[k];
            }
        }
        done();
    });

    it('should resolve path info correctly for top-level installed modules', function() {
        var util = require('../');
        var path = nodePath.join(__dirname, "test-project/node_modules/foo/lib/index.js");
        var pathInfo = util.getPathInfo(path, {root: nodePath.join(__dirname, "test-project")});
        expect(pathInfo).to.deep.equal({
            logicalPath: '/$/foo/lib/index',
            realPath: '/foo@1.0.0/lib/index',
            filePath: path,
            isDir: false,
            dep: {
                parentPath: '',
                childName: 'foo',
                childVersion: '1.0.0'
            }
        });
    });

    it('should resolve path info correctly for directories', function() {
        var util = require('../');
        var path;
        var pathInfo;

        path = nodePath.join(__dirname, "test-project/node_modules/foo");
        pathInfo = util.getPathInfo(path, {root: nodePath.join(__dirname, "test-project")});
        expect(pathInfo).to.deep.equal({
            logicalPath: '/$/foo',
            realPath: '/foo@1.0.0',
            filePath: path,
            isDir: true,
            dep: {
                parentPath: '',
                childName: 'foo',
                childVersion: '1.0.0'
            },
            main: {
                filePath: nodePath.join(__dirname, "test-project/node_modules/foo/lib/index.js"),
                path: 'lib/index'
            }
        });

        path = nodePath.join(__dirname, "test-project/node_modules/bar");
        pathInfo = util.getPathInfo(path, {root: nodePath.join(__dirname, "test-project")});
        expect(pathInfo).to.deep.equal({
            logicalPath: '/$/bar',
            realPath: '/bar@2.0.0',
            filePath: path,
            isDir: true,
            dep: {
                parentPath: '',
                childName: 'bar',
                childVersion: '2.0.0'
            },
            main: {
                filePath: nodePath.join(__dirname, "test-project/node_modules/bar/lib/index.js"),
                path: 'lib/index'
            }
        });

        path = nodePath.join(__dirname, "test-project/src/hello-world");
        pathInfo = util.getPathInfo(path, {root: nodePath.join(__dirname, "test-project")});
        expect(pathInfo).to.deep.equal({
            logicalPath: '/src/hello-world',
            realPath: '/src/hello-world',
            filePath: path,
            isDir: true,
            main: {
                filePath: nodePath.join(__dirname, "test-project/src/hello-world/index.js"),
                path: 'index'
            }
        });
    });

    it('should resolve path info correctly for second-level installed modules', function() {
        var util = require('../');
        var path = nodePath.join(__dirname, "test-project/node_modules/foo/node_modules/baz/lib/index.js");
        var pathInfo = util.getPathInfo(path, {root: nodePath.join(__dirname, "test-project")});
        expect(pathInfo).to.deep.equal({
            logicalPath: '/$/foo/$/baz/lib/index',
            realPath: '/baz@3.0.0/lib/index',
            filePath: path,
            isDir: false,
            dep: {
                parentPath: '/$/foo',
                childName: 'baz',
                childVersion: '3.0.0'
            }
        });
    });

    it('should resolve path info correctly for application modules', function() {
        var util = require('../');
        var path = nodePath.join(__dirname, "test-project/src/hello-world/index.js");
        var pathInfo = util.getPathInfo(path, {root: nodePath.join(__dirname, "test-project")});
        expect(pathInfo).to.deep.equal({
            logicalPath: '/src/hello-world/index',
            realPath: '/src/hello-world/index',
            filePath: path,
            isDir: false
        });
    });

    it('should handle browser override for main script', function() {
        require('app-module-path').addPath(nodePath.join(__dirname, 'test-project/src'));
        var resolver = require('../');
        var pathInfo = resolver.getPathInfo(nodePath.join(__dirname, 'test-project/node_modules/browser-overrides/main/index.js'), {root: nodePath.join(__dirname, "test-project")});
        expect(pathInfo).to.deep.equal({
            remap: {
                from: '/browser-overrides@0.0.0/main/index',
                to: 'browser/index_browser'
            },
            logicalPath: '/$/browser-overrides/main/browser/index_browser',
            realPath: '/browser-overrides@0.0.0/main/browser/index_browser',
            filePath: nodePath.join(__dirname, 'test-project/node_modules/browser-overrides/main/browser/index_browser.js'),
            isDir: false,
            dep: {
                parentPath: '',
                childName: 'browser-overrides',
                childVersion: '0.0.0'
            },
            isBrowserOverride: true
        });
    });

    it('should handle scoped packages', function() {

        var resolver = require('../');
        var pathInfo = resolver.getPathInfo(nodePath.join(__dirname, 'test-project/node_modules/@foo/bar/lib/index.js'), {root: nodePath.join(__dirname, "test-project")});

        expect(pathInfo).to.deep.equal({
            "filePath": nodePath.join(__dirname, 'test-project') + "/node_modules/@foo/bar/lib/index.js",
            "logicalPath": "/$/@foo/bar/lib/index",
            "realPath": "/@foo/bar@3.0.0/lib/index",
            "isDir": false,
            "dep": {
                "parentPath": "",
                "childName": "@foo/bar",
                "childVersion": "3.0.0"
            }
        });
    });


});

