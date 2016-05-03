import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Meteor } from 'meteor/meteor';
import contracts  from '/imports/startup/contracts.js';
import { Coop, CoopCode } from '/imports/contracts/Coop.js';
import Helpers from '/imports/lib/helpers/helperFunctions.js';

//TODO Need to add persistant minimongo collection?
const Coops = new Mongo.Collection('coops', {connection: null});

// Imports are read only but adding const also means the value cannot be changed
// in this (the exporting) file either. 
export { Coops };

Coops.schema = new SimpleSchema({
  name: { type: String },
  orgId: { type: String },
  ipfsHash: {type: String },
  address: {type: String }
});

Coops.attachSchema(Coops.schema);

//1. Retrieves IPFS hash from a coop contract
//2. Retrieves data from IPFS
//3. Stores data in local collection
Coops.fromEth = function(coopAddr) {
  
  //1.
  Coop.at(coopAddr).getCoopData(function(err, ipfsHash) {
        
    if(err) {
      console.log(err);
      return;
    }

    //2.
    Helpers.fromIPFS(ipfsHash, function(err, data) {
      
      // Augment Coop Data with IPFS hash and contract address
      data.ipfsHash = ipfsHash.substring(2);
      data.address = coopAddr;

      //3.  
      Coops.insert(data, function(err, res) {
        if(err) {
          console.log(err);
        }
      });

    });
  });
};

// Initialise the Coops collection. 
//1. Retrieve list of coop addresses from coop registry
//2. Fetch coop data and persist in local collection
//3. Use registry events to update local collecion.
Coops.init = function() { 
  
  //1.
  contracts.CoopRegistry.getCoops.call(function(err, coopAddresses) {
  
    // Check for error.
    if(err) {
      console.log(err);
    }  
    
    //2.
    for(var i = 0; i < coopAddresses.length; i++) {
      Coops.fromEth(coopAddresses[i]);        
    }
  });


  //3.
  contracts.CoopRegistry.newCoop({}, function(err, CREvent) {
  
    if(err) {
      console.log(err);
    }
    
    console.log("new coop added to registry");
    let newCoopAddr = CREvent.args._coop;

    Coops.fromEth(newCoopAddr);
    
  });
  
};

