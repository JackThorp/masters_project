'use strict';
require('../'); // Load the module
var chai = require('chai');
chai.Assertion.includeStack = true;
require('chai').should();
var expect = require('chai').expect;

require('../'); // Load this module just to make sure it works

describe('raptor-modules/transport.registerRemapCode' , function() {

    beforeEach(function(done) {
        for (var k in require.cache) {
            if (require.cache.hasOwnProperty(k)) {
                delete require.cache[k];
            }
        }
        done();
    });

    it('should generate correct code', function(done) {
        var transport = require('../');
        var out = transport.registerRemapCode('/foo@1.0.0/lib/index', 'index_browser');
        var code = '';
        out.on('data', function(data) {
            code += data;
        });
        out.on('end', function() {
            expect(code).to.equal('$rmod.remap("/foo@1.0.0/lib/index", "index_browser");');
            done();
        });

        out.resume();
    });
});

