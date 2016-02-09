'use strict';
require('../'); // Load the module
var nodePath = require('path');
var chai = require('chai');
chai.Assertion.includeStack = true;
require('chai').should();
var expect = require('chai').expect;
var fs = require('fs');

require('../'); // Load this module just to make sure it works

describe('raptor-modules/transport.registerDependencyCode' , function() {

    beforeEach(function(done) {
        for (var k in require.cache) {
            if (require.cache.hasOwnProperty(k)) {
                delete require.cache[k];
            }
        }
        done();
    });

    it('should generate correct dependency code for top-level dependency', function(done) {
        var transport = require('../');
        var out = transport.registerDependencyCode('', 'foo', '1.0.0');
        var code = '';
        out.on('data', function(data) {
            code += data;
        });
        out.on('end', function() {
            expect(code).to.equal('$rmod.dep("", "foo", "1.0.0");');
            done();
        });

        out.resume();
    });

    it('should generate correct dependency code for nested dependency', function(done) {
        var transport = require('../');
        var out = transport.registerDependencyCode('/node_modules/foo', 'baz', '3.0.0');
        var code = '';
        out.on('data', function(data) {
            code += data;
        });
        out.on('end', function() {
            expect(code).to.equal('$rmod.dep("/node_modules/foo", "baz", "3.0.0");');
            done();
        });

        out.resume();
    });

    it('should generate correct dependency code for dependency with an alternate name', function(done) {
        var transport = require('../');
        var out = transport.registerDependencyCode('', 'foo', '1.0.0', 'foo-browserify');
        var code = '';
        out.on('data', function(data) {
            code += data;
        });
        out.on('end', function() {
            expect(code).to.equal('$rmod.dep("", "foo-browserify", "1.0.0", "foo");');
            done();
        });

        out.resume();
    });
});

