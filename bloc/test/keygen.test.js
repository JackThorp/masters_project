var mocha = require('mocha');
var chai = require('chai');
var rewire = require('rewire');
var expect = chai.expect;
var promise = require('bluebird');

var keygen = rewire("../lib/keygen.js");

var fsMock = {
    writeFileSync:
        function (path, data, cb) {
	    return {
		"path": path,
		"data": data
	    };
        }
};

var faucetMock = function (address) {
    return new Promise(
        function (resolve, reject) {
            resolve({ 
                method: 'POST',
                uri: 'http://your-api-url.net', 
                form: {
                    address: address
                }                    
            });
        }
    );
}

keygen.__set__("fs", fsMock);
keygen.__set__("faucet", faucetMock);


describe('Key Generation', function() {
    describe('#generateKeyPreFaucet()', function () {
	var mockedKey;
	var password;
        before(function() {
	    password = 'thepassword';
	    mockedKey = keygen.generateKeyPreFaucet(password);
        });

	it('should create a key file with an address and a privkey. The address should be valid hex.', 
            function () 
            {
                expect(mockedKey.addresses).not.to.be.empty;
	        expect(mockedKey.encSeed).not.to.be.empty;
	        expect(mockedKey.encPrivKeys).not.to.be.empty;

                expect(mockedKey.addresses[0]).to.match(/^[0-9A-F]+/i);
       	    });

    	it('should successfully encrypt and decrypt with the right password. The key should be valid hex.', function () {
            var exported = mockedKey.exportPrivateKey(mockedKey.addresses[0], password);
	    
	    expect(exported).not.to.be.undefined;
            expect(exported).to.match(/^[0-9A-F]+/i);
	});

        it('should throw an exception if the password is incorrect', function () {
            expect(
                function () { 
                    mockedKey.exportPrivateKey(mockedKey.addresses[0], 'not the password');
                }).to.throw('Invalid Password');
	});
    });
    
    describe('#generateKey()', function () {
	var mockedKey;
	var mockedKeyFile;
	var password;
	
	before(function() {
            password = 'thepassword';
	    mockedKey = keygen.generateKeyPreFaucet(password);
	    mockedKeyFile = keygen.writeKeyToDisk(mockedKey);
	});
	it('should create a key file called key.json', function () {
            expect(mockedKeyFile.path).to.match(/key.json/);
	});

    	it('should POST to the faucet', function () {
	    return keygen.generateKey(password).then(function(result) {
                expect(result.form.address).to.not.be.undefined;
	    }, function (err) {
		console.log("err: " + JSON.stringify(err));
	    });
	});

    	it('should have an address POST param', function () {
	    return keygen.generateKey(password).then(function(result) {
                expect(result.method).to.equal('POST');
	    }, function (err) {
		console.log("err: " + JSON.stringify(err));
	    });
	});
   });
});

describe('Multi Key Generation', function() {
    describe('#generateKeysPreFaucet()', function () {
	var mockedKeyArray;
	var password;
	var numKeys;
	
        before(function() {
	    password = 'thepassword';
	    numKeys = 3;
	    mockedKeyArray = keygen.generateKeysPreFaucet(password,numKeys);
        });

	it('should create keys each with an address and a privkey', function () {
	    var i;
	    mockedKeyArray.map(function(store) {  
                expect(store.addresses).not.to.be.empty;
       	        expect(store.encSeed).not.to.be.empty;
		expect(store.encPrivKeys).not.to.be.empty;
	    });
	});

    	it('should successfully encrypt and decrypt each with the right password', function () {

	    mockedKeyArray.map(function(store) {
	        var exported = store.exportPrivateKey(store.addresses[0], password);
		expect(exported).not.to.be.undefined;
	    });
	});

        it('should throw an exception if the password is incorrect', function () {
            expect(
                function () { 
                    mockedKeyArray[0].exportPrivateKey(mockedKeyArray[0].addresses[0], 'not the password');
                }).to.throw('Invalid Password');

	});
    });
    
    describe('#generateKeys()', function () {
	var mockedKeyArray;
	var mockedKeyFileArray;
	var password;
	var numKeys;
	
	before(function() {
            password = 'thepassword';
	    numKeys = 3;
	    mockedKeyArray = keygen.generateKeysPreFaucet(password,numKeys);
	    mockedKeyFileArray = keygen.writeKeysToDisk(mockedKeyArray);
	});
	it('should create key files matching key*.json', function () {
	    mockedKeyFileArray.map(function(fileMock) { 
		expect(fileMock.path).to.match(/key\d*.json/);
	    });
	});

    	it('should POST repeatedly to the faucet', function () {
	    return keygen.generateKeys(password,numKeys).then(function(resultArray) {
                resultArray.map(function(result) { 
                   expect(result.method).to.equal('POST');
                   expect(result.form.address).to.not.be.undefined;
                });
	    }, function (err) {
		console.log("err: " + err);
	    });
        });  
   });
});
