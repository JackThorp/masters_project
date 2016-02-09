'use strict';

var chai = require('chai');
chai.Assertion.includeStack = true;
var expect = chai.expect;
var assert = chai.assert;

describe('raptor-modules/client' , function() {

    beforeEach(function(done) {
        for (var k in require.cache) {
            if (require.cache.hasOwnProperty(k)) {
                delete require.cache[k];
            }
        }
        done();
    });

    it('should throw error if trying to resolve target that is falsey', function() {
        var clientImpl = require('../');

        clientImpl.ready();

        clientImpl.def('/app/launch/index', function(require, exports, module, __filename, __dirname) {
            try {
                require.resolve('', '/some/module');
                assert(false, 'Exception should have been thrown');
            } catch(err) {
                expect(err.code).to.equal('MODULE_NOT_FOUND');
            }

            try {
                require.resolve(null, '/some/module');
                assert(false, 'Exception should have been thrown');
            } catch(err) {
                expect(err.code).to.equal('MODULE_NOT_FOUND');
            }

            try {
                require.resolve(undefined, '/some/module');
                assert(false, 'Exception should have been thrown');
            } catch(err) {
                expect(err.code).to.equal('MODULE_NOT_FOUND');
            }

            try {
                require.resolve(0, '/some/module');
                assert(false, 'Exception should have been thrown');
            } catch(err) {
                expect(err.code).to.equal('MODULE_NOT_FOUND');
            }
        });

        clientImpl.run('/app/launch/index');
    });

    it('should resolve modules using search path', function(done) {
        var clientImpl = require('../');

        // define a module for a given real path
        clientImpl.def('/baz@3.0.0/lib/index', function(require, exports, module, __filename, __dirname) {
            module.exports.test = true;
        });

        // Module "foo" requires "baz" 3.0.0
        // This will create the following link:
        // /$/foo/$/baz --> baz@3.0.0
        clientImpl.dep('/$/foo', 'baz', '3.0.0');


        var resolved;

        // Make sure that if we try to resolve "baz/lib/index" from within some module
        // located at "/$/foo" then we should get back "/$/foo/$/baz"
        resolved = clientImpl.resolve('baz/lib/index', '/$/foo');
        expect(resolved[0]).to.equal('/$/foo/$/baz/lib/index');
        expect(resolved[1]).to.equal('/baz@3.0.0/lib/index');

        // A module further nested under /$/foo should also resolve to the same
        // logical path
        resolved = clientImpl.resolve('baz/lib/index', '/$/foo/some/other/module');
        expect(resolved[0]).to.equal('/$/foo/$/baz/lib/index');
        expect(resolved[1]).to.equal('/baz@3.0.0/lib/index');

        // Code at under "/some/module" doesn't know about baz
        resolved = clientImpl.resolve('baz/lib/index', '/some/module');
        expect(resolved).to.equal(undefined);

        done();
    });

    it('should resolve absolute paths not containing installed modules', function(done) {
        var clientImpl = require('../');
        clientImpl.ready();

        var resolved;

        // define a module for a given real path
        clientImpl.def('/my/app/util', function(require, exports, module, __filename, __dirname) {
            module.exports.test = true;
        });

        resolved = clientImpl.resolve(
            '/my/app/util' /* target is absolute path to specific version of module */,
            '/my/app/index' /* from is ignored if target is absolute path */);

        expect(resolved[0]).to.equal('/my/app/util');
        expect(resolved[1]).to.equal('/my/app/util');

        done();
    });

    it('should resolve absolute paths containing installed modules', function() {

        var clientImpl = require('../');
        clientImpl.ready();

        var resolved;

        // define a module for a given real path
        clientImpl.def('/baz@3.0.0/lib/index', function(require, exports, module, __filename, __dirname) {
            module.exports.test = true;
        });

        // Module "foo" requires "baz" 3.0.0
        // This will create the following link:
        // /$/foo/$/baz --> baz@3.0.0
        clientImpl.dep('/$/foo', 'baz', '3.0.0');

        clientImpl.ready();

        // Make sure that if we try to resolve "baz" with  from within some module
        // located at "/$/foo" then we should get back "/$/foo/$/baz"
        resolved = clientImpl.resolve(
            '/$/foo/$/baz/lib/index' /* target is absolute path */,
            '/$/foo' /* the from is ignored */);

        expect(resolved[0]).to.equal('/$/foo/$/baz/lib/index');
        expect(resolved[1]).to.equal('/baz@3.0.0/lib/index');

        resolved = clientImpl.resolve(
            '/baz@3.0.0/lib/index' /* target is absolute path to specific version of module */,
            '/$/foo' /* from is ignored if target is absolute path */);

        expect(resolved[0]).to.equal('/baz@3.0.0/lib/index');
        expect(resolved[1]).to.equal('/baz@3.0.0/lib/index');

        clientImpl.def('/app/launch/index', function(require, exports, module, __filename, __dirname) {
            expect(function() {
                // Without registering "main", "/baz@3.0.0" will not be known
                resolved = require.resolve('/baz@3.0.0', '/some/module');
            }).to.throw(Error);
        });

        clientImpl.run('/app/launch/index');
    });

    it('should instantiate modules', function(done) {
        var clientImpl = require('../');
        clientImpl.ready();

        var instanceCount = 0;

        // define a module for a given real path
        clientImpl.def('/baz@3.0.0/lib/index', function(require, exports, module, __filename, __dirname) {
            instanceCount++;

            expect(module.id).to.equal('/$/foo/$/baz/lib/index');
            expect(module.filename).to.equal('/$/foo/$/baz/lib/index');

            module.exports = {
                __filename: __filename,
                __dirname: __dirname
            };
        });

        // Module "foo" requires "baz" 3.0.0
        // This will create the following link:
        // /$/foo/$/baz --> baz@3.0.0
        clientImpl.dep('/$/foo', 'baz', '3.0.0');

        var baz = clientImpl.require('baz/lib/index', '/$/foo');

        expect(instanceCount).to.equal(1);

        expect(baz.__filename).to.equal('/$/foo/$/baz/lib/index');
        expect(baz.__dirname).to.equal('/$/foo/$/baz/lib');

        clientImpl.require('baz/lib/index', '/$/foo');

        expect(instanceCount).to.equal(1);

        done();
    });

    it('should instantiate multiple instances of module if loaded from separate logical paths', function(done) {
        var clientImpl = require('../');
        clientImpl.ready();

        var instanceCount = 0;

        // define a module for a given real path
        clientImpl.def('/baz@3.0.0/lib/index', function(require, exports, module, __filename, __dirname) {
            instanceCount++;

            module.exports = {
                __filename: __filename,
                __dirname: __dirname,
                moduleId: module.id,
                moduleFilename: module.filename
            };
        });

        // Module "foo" requires "baz" 3.0.0
        // This will create the following link:
        // /$/foo/$/baz --> baz@3.0.0
        clientImpl.dep('/$/foo', 'baz', '3.0.0');

        // Module "foo" requires "baz" 3.0.0
        // This will create the following link:
        // /$/bar/$/baz --> baz@3.0.0
        clientImpl.dep('/$/bar', 'baz', '3.0.0');

        var bazFromFoo = clientImpl.require('baz/lib/index', '/$/foo');
        expect(bazFromFoo.moduleId).to.equal('/$/foo/$/baz/lib/index');
        expect(bazFromFoo.moduleFilename).to.equal('/$/foo/$/baz/lib/index');

        expect(instanceCount).to.equal(1);

        var bazFromBar = clientImpl.require('baz/lib/index', '/$/bar');
        expect(bazFromBar.moduleId).to.equal('/$/bar/$/baz/lib/index');
        expect(bazFromBar.moduleFilename).to.equal('/$/bar/$/baz/lib/index');

        expect(instanceCount).to.equal(2);

        done();
    });

    it('should throw exception if required module is not found', function(done) {

        expect(function() {
            require('something/that/does/not/exist');
        }).to.throw(Error);

        done();
    });

    it('should load modules that are objects', function(done) {
        var clientImpl = require('../');
        clientImpl.ready();

        // define a module for a given real path
        clientImpl.def('/baz@3.0.0/lib/index', {
            test: true
        });

        // Module "foo" requires "baz" 3.0.0
        // This will create the following link:
        // /$/foo/$/baz --> baz@3.0.0
        clientImpl.dep('/$/foo', 'baz', '3.0.0');

        var baz = clientImpl.require('baz/lib/index', '/$/foo');

        expect(baz.test).to.equal(true);

        done();
    });

    it('should run modules', function(done) {
        var clientImpl = require('../');
        clientImpl.ready();
        var instanceCount = 0;

        // define a module for a given real path
        clientImpl.def('/app/launch/index', function(require, exports, module, __filename, __dirname) {
            instanceCount++;
            module.exports = {
                __filename: __filename,
                __dirname: __dirname
            };
        });

        clientImpl.run('/app/launch/index');

        // run will define the instance and automatically load it
        expect(instanceCount).to.equal(1);

        // you can also require the instance again if you really want to
        var launch = clientImpl.require('/app/launch/index', '/$/foo');

        expect(instanceCount).to.equal(1);

        expect(launch.__filename).to.equal('/app/launch/index');
        expect(launch.__dirname).to.equal('/app/launch');

        // use a relative path to require it as well
        launch = clientImpl.require('./index', '/app/launch');

        expect(launch.__filename).to.equal('/app/launch/index');
        expect(launch.__dirname).to.equal('/app/launch');

        expect(instanceCount).to.equal(1);

        done();
    });

    it('should provide require function to module', function(done) {
        var clientImpl = require('../');
        clientImpl.ready();

        clientImpl.def('/app/launch/util', function(require, exports, module, __filename, __dirname) {
            module.exports.sayHello = function() {
                return 'Hello!';
            };
        });

        // define a module for a given real path
        clientImpl.def('/app/launch/index', function(require, exports, module, __filename, __dirname) {

            var util;

            // test requesting
            util = require('./util');
            expect(Object.keys(util)).to.deep.equal(['sayHello']);

            // test requiring something via absolute path
            util = require('/app/launch/util');
            expect(Object.keys(util)).to.deep.equal(['sayHello']);

            module.exports = {
                greeting: util.sayHello()
            };
        });

        clientImpl.run('/app/launch/index');

        // you can also require the instance again if you really want to
        var launch = clientImpl.require('/app/launch/index', '/$/foo');

        expect(launch.greeting).to.equal('Hello!');

        done();
    });

    it('should provide require function that has a resolve property', function(done) {

        var clientImpl = require('../');
        clientImpl.ready();

        clientImpl.def('/app/launch/util', function(require, exports, module, __filename, __dirname) {
            module.exports.sayHello = function() {
                return 'Hello!';
            };
        });

        // define a module for a given real path
        clientImpl.def('/app/launch/index', function(require, exports, module, __filename, __dirname) {

            expect(require('./util')).to.equal(require(require.resolve('./util')));

            var util = require('./util');

            module.exports = {
                greeting: util.sayHello()
            };
        });

        clientImpl.run('/app/launch/index');

        done();

    });

    it('should not instantiate during require.resolve(target) call', function(done) {

        var clientImpl = require('../');
        clientImpl.ready();

        var instanceCount = 0;

        clientImpl.def('/app/launch/util', function(require, exports, module, __filename, __dirname) {
            instanceCount++;

            module.exports.sayHello = function() {
                return 'Hello!';
            };
        });

        // define a module for a given real path
        clientImpl.def('/app/launch/index', function(require, exports, module, __filename, __dirname) {

            var logicalPath = require.resolve('./util');

            expect(logicalPath).to.equal('/app/launch/util');
            expect(instanceCount).to.equal(0);
        });

        clientImpl.run('/app/launch/index');

        done();

    });

    it('should allow factory to provide new exports', function(done) {

        var clientImpl = require('../');
        clientImpl.ready();

        clientImpl.def('/app/launch/util', function(require, exports, module, __filename, __dirname) {
            module.exports = {
                greeting: 'Hello!'
            };
        });

        // define a module for a given real path
        clientImpl.def('/app/launch/index', function(require, exports, module, __filename, __dirname) {
            var util = require('./util');
            expect(util.greeting).to.equal('Hello!');
        });

        clientImpl.run('/app/launch/index');

        done();

    });

    it('should allow factory to add properties to export', function(done) {

        var clientImpl = require('../');
        clientImpl.ready();

        clientImpl.def('/app/launch/util', function(require, exports, module, __filename, __dirname) {
            module.exports.greeting = 'Hello!';
        });

        // define a module for a given real path
        clientImpl.def('/app/launch/index', function(require, exports, module, __filename, __dirname) {
            var util = require('./util');
            expect(util.greeting).to.equal('Hello!');
        });

        clientImpl.run('/app/launch/index');

        done();
    });

    it('should allow factory to be object', function(done) {

        var clientImpl = require('../');
        clientImpl.ready();

        clientImpl.def('/app/launch/util', {
            greeting: 'Hello!'
        });

        // define a module for a given real path
        clientImpl.def('/app/launch/index', function(require, exports, module, __filename, __dirname) {
            var util = require('./util');
            expect(util.greeting).to.equal('Hello!');
        });

        clientImpl.run('/app/launch/index');

        done();
    });

    it('should allow factory to be null object', function(done) {

        /*
         * NOTE: Using null doesn't provide much value but it is an object
         * so we'll just return null as the exports. We will however, treat
         * undefined specially.
         */
        var clientImpl = require('../');
        clientImpl.ready();

        clientImpl.def('/app/launch/util', null);

        // define a module for a given real path
        clientImpl.def('/app/launch/index', function(require, exports, module, __filename, __dirname) {
            var util = require('./util');
            expect(util).to.equal(null);
        });

        clientImpl.run('/app/launch/index');

        done();
    });

    it('should allow factory to be undefined object', function(done) {

        var clientImpl = require('../');
        clientImpl.ready();

        // An undefined value as factory will remove the definition and make it
        // appear as though the module does not exist
        clientImpl.def('/app/launch/util', undefined);

        // define a module for a given real path
        clientImpl.def('/app/launch/index', function(require, exports, module, __filename, __dirname) {
            expect(function() {
                require('./util');
            }).to.throw(Error);
        });

        clientImpl.run('/app/launch/index');

        done();
    });

    it('should find targets with or without ".js" extension', function(done) {

        var clientImpl = require('../');
        clientImpl.ready();

        var instanceCount = 0;

        clientImpl.def('/app/launch/util', function(require, exports, module, __filename, __dirname) {
            instanceCount++;
            module.exports.greeting = 'Hello!';
        });

        clientImpl.def('/app/launch/index', function(require, exports, module, __filename, __dirname) {
            var util0 = require('./util.js');
            var util1 = require('./util');

            expect(instanceCount).to.equal(1);
            expect(util0).to.equal(util1);
            expect(util0.greeting).to.equal('Hello!');
        });

        // define a module for a given real path
        clientImpl.run('/app/launch/index');

        done();
    });

    it('should resolve targets with or without ".js" extension', function(done) {

        var clientImpl = require('../');
        clientImpl.ready();

        var instanceCount = 0;

        clientImpl.def('/app/launch/util', function(require, exports, module, __filename, __dirname) {
            instanceCount++;
            module.exports.greeting = 'Hello!';
        });

        // define a module for a given real path
        clientImpl.def('/app/launch/index', function(require, exports, module, __filename, __dirname) {

            expect(require.resolve('./util.js')).to.equal('/app/launch/util');
            expect(require.resolve('./util')).to.equal('/app/launch/util');

            expect(instanceCount).to.equal(0);
        });

        clientImpl.run('/app/launch/index');

        done();
    });

    it('should find targets when definition includes extension', function(done) {

        var clientImpl = require('../');
        clientImpl.ready();

        var instanceCount = 0;

        clientImpl.def('/app/launch/do.something', function(require, exports, module, __filename, __dirname) {
            instanceCount++;
            module.exports.greeting = 'Hello!';
        });

        // define a module for a given real path
        clientImpl.def('/app/launch/index', function(require, exports, module, __filename, __dirname) {
            var util0 = require('./do.something.js');
            var util1 = require('./do.something');

            expect(instanceCount).to.equal(1);
            expect(util0).to.equal(util1);
            expect(util0.greeting).to.equal('Hello!');
        });

        clientImpl.run('/app/launch/index');

        done();
    });

    it('should allow main file to be specified for any directory', function(done) {

        var clientImpl = require('../');
        clientImpl.ready();

        var instanceCount = 0;

        clientImpl.def('/app/lib/index', function(require, exports, module, __filename, __dirname) {
            instanceCount++;

            expect(__dirname).to.equal('/app/lib');
            expect(__filename).to.equal('/app/lib/index');

            module.exports.greeting = 'Hello!';
        });

        clientImpl.main('/app', 'lib/index');

        var resolved;

        resolved = clientImpl.resolve('../../lib/index', '/app/lib/launch');
        expect(resolved[0]).to.equal('/app/lib/index');

        resolved = clientImpl.resolve('../../', '/app/lib/launch');
        expect(resolved[0]).to.equal('/app/lib/index');

        // define a module for a given real path
        clientImpl.def('/app/lib/launch', function(require, exports, module, __filename, __dirname) {

            expect(__dirname).to.equal('/app/lib');
            expect(__filename).to.equal('/app/lib/launch');

            // all of the follow require statements are equivalent to require('/app/lib/index')
            var app0 = require('../');
            var app1 = require('/app');
            var app2 = require('/app/lib/index');
            var app3 = require('/app/lib/index.js');
            var app4 = require('./index');
            var app5 = require('./index.js');

            expect(instanceCount).to.equal(1);

            expect(app0.greeting).to.equal('Hello!');

            assert(app1 === app0 &&
                   app2 === app0 &&
                   app3 === app0 &&
                   app4 === app0 &&
                   app5 === app0, 'All instances are not equal to each other');
        });

        clientImpl.run('/app/lib/launch');

        done();
    });

    it('should allow main file to be specified for a module', function(done) {

        var clientImpl = require('../');
        clientImpl.ready();

        var instanceCount = 0;

        clientImpl.def('/streams@1.0.0/lib/index', function(require, exports, module, __filename, __dirname) {
            instanceCount++;

            expect(__dirname).to.equal('/streams@1.0.0/app/lib');
            expect(__filename).to.equal('/streams@1.0.0/app/lib/index');

            module.exports.greeting = 'Hello!';
        });

        clientImpl.main('/streams@1.0.0', 'lib/index');

        clientImpl.dep('', 'streams', '1.0.0');

        // define a module for a given real path
        clientImpl.def('/app', function(require, exports, module, __filename, __dirname) {

            expect(__dirname).to.equal('');
            expect(__filename).to.equal('/app');

            expect(require.resolve('streams')).to.equal('/$/streams/lib/index');
        });

        clientImpl.run('/app');

        // define a module for a given real path
        clientImpl.def('/app/launch', function(require, exports, module, __filename, __dirname) {

            expect(__dirname).to.equal('/app');
            expect(__filename).to.equal('/app/launch');

            expect(require.resolve('streams')).to.equal('/$/streams/lib/index');
            expect(require.resolve('streams/lib/index')).to.equal('/$/streams/lib/index');
        });

        clientImpl.run('/app/launch');

        done();
    });

    it('should handle remapping individual files', function(done) {

        var clientImpl = require('../');
        clientImpl.ready();

        clientImpl.def('/universal@1.0.0/lib/index', function(require, exports, module, __filename, __dirname) {
            module.exports = {
                name: 'default'
            };
        });

        clientImpl.def('/universal@1.0.0/lib/browser/index', function(require, exports, module, __filename, __dirname) {
            module.exports = {
                name: 'browser'
            };
        });

        clientImpl.main('/universal@1.0.0', 'lib/index');

        clientImpl.dep('', 'universal', '1.0.0');

        // require "universal" before it is remapped
        var runtime0 = clientImpl.require('universal', '/app/lib');
        expect(runtime0.name).to.equal('default');
        expect(clientImpl.require('universal/lib/index', '/app/lib')).to.equal(runtime0);

        clientImpl.remap(
            // choose a specific "file" to remap
            '/universal@1.0.0/lib/index',
            // following path is relative to /universal@1.0.0/lib
            './browser/index');

        // require "universal" after it is remapped
        var runtime1 = clientImpl.require('universal', '/app/lib');
        expect(runtime1.name).to.equal('browser');
        expect(clientImpl.require('universal/lib/index', '/app/lib')).to.equal(runtime1);

        done();
    });

    it('should handle remapping entire modules to shim modules', function(done) {
        var clientImpl = require('../');
        clientImpl.ready();

        clientImpl.def('/streams-browser@1.0.0/lib/index', function(require, exports, module, __filename, __dirname) {

            expect(__dirname).to.equal('/$/streams-browser/lib');
            expect(__filename).to.equal('/$/streams-browser/lib/index');

            module.exports = {
                name: 'browser'
            };
        });

        clientImpl.dep(
            // logical path
            '',

            // depends on streams-browser 1.0.0
            'streams-browser', '1.0.0',

            // streams-browser is also known as "streams"
            'streams');

        //clientImpl.remap('streams', 'streams-browser', '/abc');

        // requiring "streams" effectively a require on "streams-browser";
        var streams1 = clientImpl.require('streams/lib/index', '/app/lib/index');
        var streams2 = clientImpl.require('/$/streams/lib/index', '/app/lib/index');

        expect(streams1).to.equal(streams2);

        expect(streams1.name).to.equal('browser');

        done();
    });

    it('should join relative paths', function(done) {
        // NOTE: Second argument to join should start with "." or "..".
        //       I don't care about joining an absolute path, empty string
        //       or even a "module name" because these are handled specially
        //       in the resolve method.
        var clientImpl = require('../');
        clientImpl.ready();

        expect(clientImpl.join('/foo/baz', './abc.js')).to.equal('/foo/baz/abc.js');
        expect(clientImpl.join('/foo/baz', '../abc.js')).to.equal('/foo/abc.js');
        expect(clientImpl.join('/foo', '..')).to.equal('/');
        expect(clientImpl.join('/foo', '../..')).to.equal('');
        expect(clientImpl.join('foo', '..')).to.equal('');
        expect(clientImpl.join('foo/bar', '../test.js')).to.equal('foo/test.js');
        expect(clientImpl.join('abc/def', '.')).to.equal('abc/def');
        expect(clientImpl.join('/', '.')).to.equal('/');
        expect(clientImpl.join('/', '.')).to.equal('/');
        expect(clientImpl.join('/app/lib/launch', '../../')).to.equal('/app');
        expect(clientImpl.join('/app/lib/launch', '../..')).to.equal('/app');
        expect(clientImpl.join('/app/lib/launch', './../..')).to.equal('/app');
        expect(clientImpl.join('/app/lib/launch', './../.././././')).to.equal('/app');
        done();
    });

    it('should run module from root', function(done) {
        var clientImpl = require('../');
        clientImpl.ready();

        /*
        TEST SETUP:

        Call require('raptor-util') from within the following file:
        /node_modules/marko-widgets/lib/index.js

        'raptor-util' is installed as a dependency for the top-level 'raptor-modules' module
        */


        var widgetsModule = null;
        // var raptorUtilModule = null;
        clientImpl.dep('/$/marko-widgets', 'raptor-util', '0.1.0-SNAPSHOT');
        clientImpl.main('/raptor-util@0.1.0-SNAPSHOT', 'lib/index');
        clientImpl.def('/raptor-util@0.1.0-SNAPSHOT/lib/index', function(require, exports, module, __filename, __dirname) {
            exports.filename = __filename;
        });

        clientImpl.dep('', 'marko-widgets', '0.1.0-SNAPSHOT');
        clientImpl.main('/marko-widgets@0.1.0-SNAPSHOT', 'lib/index');
        clientImpl.main('/marko-widgets@0.1.0-SNAPSHOT/lib', 'index');
        clientImpl.def('/marko-widgets@0.1.0-SNAPSHOT/lib/index', function(require, exports, module, __filename, __dirname) {
            exports.filename = __filename;
            exports.raptorUtil = require('raptor-util');
        });

        // define a module for a given real path
        clientImpl.def('/__widgets', function(require, exports, module, __filename, __dirname) {
            widgetsModule = require('/$/marko-widgets');
        });

        clientImpl.run('/__widgets');

        // run will define the instance and automatically load it
        expect(widgetsModule.filename).to.equal('/$/marko-widgets/lib/index');
        expect(widgetsModule.raptorUtil.filename).to.equal('/$/marko-widgets/$/raptor-util/lib/index');

        done();
    });

    it('should allow main with a relative path', function(done) {
        var clientImpl = require('../');
        clientImpl.ready();

        // /$/foo depends on bar@0.1.0-SNAPSHOT
        clientImpl.dep('/$/foo', 'bar', '0.1.0-SNAPSHOT');

        // Requiring "/$/foo/$/bar/Baz" should actually resolve to "/$/foo/$/bar/lib/Baz"
        clientImpl.main('/bar@0.1.0-SNAPSHOT/Baz', '../lib/Baz');

        // Define the bar/lib/Baz module
        clientImpl.def('/bar@0.1.0-SNAPSHOT/lib/Baz', function(require, exports, module, __filename, __dirname) {
            exports.isBaz = true;
        });

        // Add dependency /$/foo --> /foo@0.1.0-SNAPSHOT
        clientImpl.dep('', 'foo', '0.1.0-SNAPSHOT');

        // Requiring "/$/foo" should actually resolve to  "/$/foo/lib/index"
        clientImpl.main('/foo@0.1.0-SNAPSHOT', 'lib/index');

        // Define foo/lib/index
        clientImpl.def('/foo@0.1.0-SNAPSHOT/lib/index', function(require, exports, module, __filename, __dirname) {
            expect(module.id).to.equal('/$/foo/lib/index');

            exports.Baz = require('bar/Baz');

            // make sure that "bar/Baz" resolves to "bar/lib/Baz"
            expect(require('bar/lib/Baz')).to.equal(require('bar/Baz'));
        });

        var Baz = null;
        clientImpl.def('/bar', function(require, exports, module, __filename, __dirname) {
            var foo = require('foo');
            Baz = foo.Baz;

        });

        clientImpl.run('/bar');

        expect(Baz.isBaz).to.equal(true);

        done();
    });

    it('should handle browser overrides', function() {
        var clientImpl = require('../');
        clientImpl.ready();

        clientImpl.dep('/$/async-writer', 'events-browserify', '0.0.1', 'events');
        clientImpl.main('/events-browserify@0.0.1', 'events');

        clientImpl.def('/events-browserify@0.0.1/events', function(require, exports, module, __filename, __dirname) {
            exports.EVENTS_BROWSERIFY = true;
        });

        clientImpl.dep('', 'async-writer', '0.1.0-SNAPSHOT');
        clientImpl.main('/async-writer@0.1.0-SNAPSHOT', 'lib/async-writer');
        clientImpl.def('/async-writer@0.1.0-SNAPSHOT/lib/async-writer', function(require, exports, module, __filename, __dirname) {
            exports.RAPTOR_RENDER_CONTEXT = true;
            exports.events = require('events');
        });

        var raptorRenderContext = null;
        clientImpl.def('/main', function(require, exports, module, __filename, __dirname) {
            raptorRenderContext = require('async-writer');
        });

        clientImpl.run('/main');

        expect(raptorRenderContext.RAPTOR_RENDER_CONTEXT).to.equal(true);
        expect(raptorRenderContext.events.EVENTS_BROWSERIFY).to.equal(true);
    });

    it('should handle browser override for main', function() {
        var clientImpl = require('../');
        clientImpl.ready();

        var processModule = null;

        clientImpl.def('/process@0.6.0/browser', function(require, exports, module, __filename, __dirname) {
            exports.PROCESS = true;
        });


        clientImpl.dep('', 'process', '0.6.0');
        clientImpl.remap('/process@0.6.0/index', 'browser');
        clientImpl.main('/process@0.6.0', 'index');

        clientImpl.def('/main', function(require, exports, module, __filename, __dirname) {
            processModule = require('process');
        });

        clientImpl.run('/main');

        expect(processModule.PROCESS).to.equal(true);
    });

    it('should handle browser override for main', function() {
        var clientImpl = require('../');
        clientImpl.ready();

        var markoModule = null;

        clientImpl.def('/marko@0.1.0-SNAPSHOT/runtime/lib/marko', function(require, exports, module, __filename, __dirname) {
            exports.RAPTOR_TEMPLATES = true;
            exports.raptorRenderContext = require('async-writer');
        });

        // install dependency /$/marko (version 0.1.0-SNAPSHOT)
        clientImpl.dep('', 'marko', '0.1.0-SNAPSHOT');

        // If something like "/$/marko" is required then
        // use "/$/marko/runtime/lib/marko"
        clientImpl.main('/marko@0.1.0-SNAPSHOT', 'runtime/lib/marko');

        clientImpl.def('/async-writer@0.1.0-SNAPSHOT/lib/async-writer', function(require, exports, module, __filename, __dirname) {
            exports.RAPTOR_RENDER_CONTEXT = true;
        });

        clientImpl.main('/async-writer@0.1.0-SNAPSHOT', 'lib/async-writer');

        // install dependency /$/marko/$/async-writer (version 0.1.0-SNAPSHOT)
        clientImpl.dep('/$/marko', 'async-writer', '0.1.0-SNAPSHOT');

        clientImpl.def('/main', function(require, exports, module, __filename, __dirname) {
            markoModule = require('marko');
        });

        clientImpl.run('/main');

        expect(markoModule.RAPTOR_TEMPLATES).to.equal(true);
        expect(markoModule.raptorRenderContext.RAPTOR_RENDER_CONTEXT).to.equal(true);

    });

    it('should allow a module to be mapped to a global', function(done) {
        var clientImpl = require('../');

        // define a module for a given real path
        clientImpl.def('/jquery@1.0.0/lib/index', function(require, exports, module, __filename, __dirname) {
            exports.jquery = true;
        }, {'globals': ['$']});

        expect(global.$.jquery).to.equal(true);

        done();
    });

    it('should allow search paths', function() {
        var clientImpl = require('../');

        clientImpl.ready();

        clientImpl.addSearchPath('/src/');

        // define a module for a given real path
        clientImpl.def('/src/my-module', function(require, exports, module, __filename, __dirname) {
            module.exports.test = true;
        });

        var myModule;

        clientImpl.def('/main', function(require, exports, module, __filename, __dirname) {
            myModule = require('my-module');
        });

        clientImpl.run('/main');

        expect(myModule).to.not.equal(undefined);
        expect(myModule.test).to.equal(true);
    });

    it('should run installed modules', function(done) {
        var clientImpl = require('../');
        clientImpl.ready();

        var initModule = null;

        clientImpl.def("/require-run@1.0.0/foo", function(require, exports, module, __filename, __dirname) {
            module.exports = {
                __filename: __filename,
                __dirname: __dirname
            };
        });
        clientImpl.dep("", "require-run", "1.0.0");
        clientImpl.def("/require-run@1.0.0/init", function(require, exports, module, __filename, __dirname) {
            var foo = require('./foo');
            initModule = {
                foo: foo,
                __filename: __filename,
                __dirname: __dirname
            };
        });
        clientImpl.run("/$/require-run/init", {"wait":false});


        // run will define the instance and automatically load it

        expect(initModule.__dirname).to.equal('/$/require-run');
        expect(initModule.__filename).to.equal('/$/require-run/init');
        expect(initModule.foo.__dirname).to.equal('/$/require-run');
        expect(initModule.foo.__filename).to.equal('/$/require-run/foo');

        done();
    });

    it('should run installed modules from app module', function(done) {
        var clientImpl = require('../');
        clientImpl.ready();

        var initModule = null;

        clientImpl.def("/require-run@1.0.0/foo", function(require, exports, module, __filename, __dirname) {
            module.exports = {
                __filename: __filename,
                __dirname: __dirname
            };
        });
        clientImpl.dep("", "require-run", "1.0.0");
        clientImpl.def("/require-run@1.0.0/init", function(require, exports, module, __filename, __dirname) {
            var foo = require('./foo');
            initModule = {
                foo: foo,
                __filename: __filename,
                __dirname: __dirname
            };
        });
        clientImpl.run("/$/require-run/init", {"wait":false});


        // run will define the instance and automatically load it

        expect(initModule.__dirname).to.equal('/$/require-run');
        expect(initModule.__filename).to.equal('/$/require-run/init');
        expect(initModule.foo.__dirname).to.equal('/$/require-run');
        expect(initModule.foo.__filename).to.equal('/$/require-run/foo');

        done();
    });

    it('should handle requiring of a pre-resolved absolute paths', function(done) {
        var clientImpl = require('../');
        clientImpl.remap("/add", "add-browser");
        clientImpl.main("/foo@1.0.0", "lib/index");
        clientImpl.dep("", "foo", "1.0.0");
        clientImpl.dep("/$/foo", "./lib/bar-shim", null, "bar");
        clientImpl.remap("/foo@1.0.0/lib/baz", "baz-browser");
        clientImpl.dep("", "./hello-shim", null, "hello");
        clientImpl.main("/world-shim@1.0.0", "lib/index");
        clientImpl.dep("", "world-shim", "1.0.0", "world");
        clientImpl.dep("", "world-shim", "1.0.0");
        clientImpl.dep("", "./jquery-shim", null, "jquery");

        clientImpl.def("/foo@1.0.0/lib/bar-shim", function(require, exports, module, __filename, __dirname) {
            module.exports = {
                name: 'bar-shim',
                __filename: __filename,
                __dirname: __dirname
            };
        });

        clientImpl.def("/foo@1.0.0/lib/baz-browser", function(require, exports, module, __filename, __dirname) {
            module.exports = {
                name: 'baz-browser',
                __filename: __filename,
                __dirname: __dirname
            };
        });

        clientImpl.def("/foo@1.0.0/lib/index", function(require, exports, module, __filename, __dirname) {
            exports.name = 'foo/lib/index';
            exports.bar = require('bar');
            exports.baz = require('./baz');
            exports.__filename = __filename;
            exports.__dirname = __dirname;
        });

        clientImpl.def("/world-shim@1.0.0/lib/index", function(require, exports, module, __filename, __dirname) {
            module.exports = {
                name: 'world-shim/lib/index',
                __filename: __filename,
                __dirname: __dirname
            };
        });

        clientImpl.def("/hello-shim", function(require, exports, module, __filename, __dirname) {
            module.exports = {
                name: 'hello-shim',
                __filename: __filename,
                __dirname: __dirname
            };
        });

        clientImpl.def("/add-browser", function(require, exports, module, __filename, __dirname) {
            module.exports = {
                name: 'add-browser',
                __filename: __filename,
                __dirname: __dirname
            };
        });

        clientImpl.def("/jquery-shim", function(require, exports, module, __filename, __dirname) {
            module.exports = {
                name: 'jquery-shim',
                __filename: __filename,
                __dirname: __dirname
            };
        },{"globals":["$","jQuery"]});

        clientImpl.def("/main", function(require, exports, module, __filename, __dirname) {

            var add = require('./add');
            var foo = require('foo');
            var hello = require('hello');
            var world = require('world');
            var jquery = require('jquery');

            exports.add = add;
            exports.foo = foo;
            exports.hello = hello;
            exports.world = world;
            exports.jquery = jquery;
        });

        // you can also require the instance again if you really want to
        var main = clientImpl.require('/main', '/');

        expect(main.add.__filename).to.equal('/add-browser');
        expect(main.add.name).to.equal('add-browser');

        expect(main.foo.bar.__filename).to.equal('/$/foo/lib/bar-shim');
        expect(main.foo.bar.name).to.equal('bar-shim');

        expect(main.foo.baz.__filename).to.equal('/$/foo/lib/baz-browser');
        expect(main.foo.baz.name).to.equal('baz-browser');

        expect(main.foo.__filename).to.equal('/$/foo/lib/index');
        expect(main.foo.name).to.equal('foo/lib/index');

        expect(main.hello.__filename).to.equal('/hello-shim');
        expect(main.hello.name).to.equal('hello-shim');

        expect(main.world.__filename).to.equal('/$/world-shim/lib/index');
        expect(main.world.name).to.equal('world-shim/lib/index');

        expect(main.jquery.__filename).to.equal('/jquery-shim');
        expect(main.jquery.name).to.equal('jquery-shim');

        done();
    });

    it('should only load one instance of a module with globals', function() {
        var clientImpl = require('../');
        clientImpl.ready();

        var jQueryLoadCounter = 0;
        var mainJquery;

        clientImpl.def("/jquery@1.11.3/dist/jquery", function(require, exports, module, __filename, __dirname) {
            exports.isJquery = true;

            jQueryLoadCounter++;

        },{"globals":["$","jQuery"]});

        var mainDidRun = false;

        clientImpl.def("/jquery-main", function(require, exports, module, __filename, __dirname) {
            mainDidRun = true;
            mainJquery = require('jquery');
        });

        clientImpl.main("/jquery@1.11.3", "dist/jquery");
        clientImpl.dep("", "jquery", "1.11.3");
        clientImpl.run('/jquery-main');

        expect(mainDidRun).to.equal(true);

        expect(mainJquery.isJquery).to.equal(true);

        expect(jQueryLoadCounter).to.equal(1);
        expect(mainJquery).to.equal(global.$);
    });

    it('should handle root paths correctly', function() {
        var clientImpl = require('../');
        clientImpl.ready();

        var libIndex = null;

        clientImpl.main("/", "lib/index");

        clientImpl.def('/lib/index', function(require, exports, module, __filename, __dirname) {
            exports.LIB_INDEX = true;
        });

        clientImpl.def('/main', function(require, exports, module, __filename, __dirname) {
            libIndex = require('../');
        });

        clientImpl.run('/main');

        expect(libIndex.LIB_INDEX).to.equal(true);
    });

    it('should handle scoped modules', function(done) {
        var clientImpl = require('../');
        clientImpl.ready();

        var instanceCount = 0;

        // define a module for a given real path
        clientImpl.def('/@foo/bar@3.0.0/lib/index', function(require, exports, module, __filename, __dirname) {
            instanceCount++;
            module.exports = {
                __filename: __filename,
                __dirname: __dirname
            };
        });

        // Module "foo" requires "baz" 3.0.0
        // This will create the following link:
        // /$/foo/$/baz --> baz@3.0.0
        clientImpl.dep('', '@foo/bar', '3.0.0');

        var fooBar = clientImpl.require('@foo/bar/lib/index', '/$/foo');

        expect(instanceCount).to.equal(1);

        expect(fooBar.__filename).to.equal('/$/@foo/bar/lib/index');
        expect(fooBar.__dirname).to.equal('/$/@foo/bar/lib');

        done();
    });
});
