var lw = require('eth-lightwallet');
var fs = require('fs');
var faucet = require("blockapps-js").routes.faucet;
var Promise = require('bluebird');

module.exports = {
    writeKeyToDisk : writeKeyToDisk,
    writeKeysToDisk : writeKeysToDisk,
    generateKeyPreFaucet : generateKeyPreFaucet,
    generateKeysPreFaucet : generateKeysPreFaucet,
    generateKey : generateKey,
    generateKeys : generateKeys,
    readKeystore : readKeystore
}

function writeKeyToDisk (store) {
    return fs.writeFileSync('key.json', store.serialize()); // return for testing purposes, writeFileSync normally doesn't return anything
}

function writeKeysToDisk (storeArray) {
    return storeArray.map(function (store,index) {
	return fs.writeFileSync('key'+index+'.json', store.serialize());
    });
}

function generateKeyPreFaucet (password) {
    var seed = lw.keystore.generateRandomSeed();
    var store = new lw.keystore(seed, password);
    store.generateNewAddress(password);
    writeKeyToDisk(store);
    return store;
}

function generateKey (password) {
    var store = generateKeyPreFaucet(password);
    return faucet(store.addresses[0]);
}

function generateKeysPreFaucet (password, numKeys) {
    var seed;
    var storeArray = [];

    var i;

    for (i = 0; i < numKeys; i++) {
	seed = lw.keystore.generateRandomSeed();
        store = new lw.keystore(seed, password);
	store.generateNewAddress(password);
	storeArray.push(store);
    }

    writeKeysToDisk(storeArray);
    
    return storeArray;
}

function generateKeys (password, numKeys) {
    var storeArray = generateKeysPreFaucet(password, numKeys);
    return Promise.reduce(storeArray, function(total,store,index) { 

       return faucet(store.addresses[0]).then(function (result) {
           total.push(result);
           return total;
       });
    }
    , []); 
}

function readKeystore() {
  return new lw.keystore.deserialize(fs.readFileSync('key.json'));
}
