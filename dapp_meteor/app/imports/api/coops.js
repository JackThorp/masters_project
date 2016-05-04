import { Mongo }        from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Meteor }       from 'meteor/meteor';
import _                from 'lodash';

import { Coop, CoopCode } from '/imports/contracts/Coop.js';
import contracts          from '/imports/startup/contracts.js';
import Helpers            from '/imports/lib/helpers/helperFunctions.js';

//TODO Need to add persistant minimongo collection?
const Coops = new Mongo.Collection('coops', {connection: null});

// Imports are read only but adding const also means the value cannot be changed
// in this (the exporting) file either. 
export { Coops };

Coops.schema = new SimpleSchema({
  name:     { type: String },
  orgId:    { type: String },
  ipfsHash: { type: String },
  address:  { type: String },
  members:  { type: [String], optional: true }
});

Coops.attachSchema(Coops.schema);

Coops.helpers({

  fillMembers(cb) {
    var thisCoop = this
    var fullMembers = [];
    var memberCounter = 0;
    var memberSize = thisCoop.members.length
    for(var i = 0; i < memberSize; i++) {
      
      contracts.UserRegistry.getUserData(thisCoop.members[i], function(err, ipfsHex) {
      
        // Check for error.
        if(err) {
          console.log(err);
          return;
        }

        // 'Current user' is not yet registered in userdb.
        if(ipfsHex == "0x") {
          console.log("member not registered as user?");
          return;
        }

        Helpers.fromIPFS(ipfsHex, function(err, memberData) {
         
          fullMembers.push(memberData);
          memberCounter++;
          if(memberCounter == memberSize) {
            cb(fullMembers);
          }
          //thisCoop.members[i] = memberData; // Set member data
          
        });
      });
    }
  }
});

//1. Retrieves IPFS hash from a coop contract
//2. Retrieves data from IPFS
//3. Retrieve member data from Ethereum
//4. Stores data in local collection
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

      contracts.MembershipRegistry.getMembers(coopAddr, function(err, _members) {
        
        if(err) {
          console.log(err);
          return;
        }
        
        data.members = _members;
        
        //3.  
        Coops.insert(data, function(err, res) {
          if(err) {
            console.log(err);
          }
        });

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

  //3.
  contracts.MembershipRegistry.newMembership({}, function(err, MREvent) {
    
    if(err) {
      console.log(err);
    }

    console.log('new membership!');
    let coopAddr = MREvent.args._coop;
    let memberAddr = MREvent.args._member;
   
    Coops.update({
      address: coopAddr
    }, { 
      $push: {
        members: memberAddr
      }
    });

  });
  
};

