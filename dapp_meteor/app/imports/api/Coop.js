import _          from 'lodash';
import Promise    from 'bluebird'
import contracts  from '/imports/startup/contracts.js';
import { db }     from '/imports/api/db.js';
var membershipRegistry = Promise.promisifyAll(contracts.MembershipRegistry);

class Coop {
  
  constructor(addr, data) {
    this.data = data;
    this.address = addr;
  }
  
  addMember(userAddr) {

    var txObj = {
      from: web3.eth.accounts[0],
      gas: 400000,
      gasPrice: web3.eth.gasPrice
    }

    let coopAddr = this.address;
    var registeredPromise = membershipRegistry.newMembershipAsync({
      _member: userAddr,
      _coop: coopAddr
    });
    membershipRegistry.registerAsync(userAddr, coopAddr, txObj).catch(function(err) {
      console.log(err);
    });
    return registeredPromise;
  }

  // Fetches the coops members
  fetchMembers() {
    let coop = this;

    return membershipRegistry.getMembersAsync(coop.address).then(function(memberAddresses) {
      
      var memberPromises = [];
      console.log(memberAddresses);
      for(var i = 0; i < memberAddresses.length; i++) {
        
        // Use reflect to implement settle all 
        memberPromises.push(db.users.get(memberAddresses[i]).reflect());
      }
      return Promise.all(memberPromises);
    })
    .filter(function(memberPromise) {
      return memberPromise.isFulfilled();
    })
    .map(function(memberPromise){
      return memberPromise.value();
    })
    .then(function(members) {
      console.log(members);
      coop.members = members;
      return coop;
    });
  }

  // Validates coop (only works for Coops UK account)
  authorise() {

  }
}

export default Coop;

/*
    .then(function(data) {
      console.log(data);
      // create coop object with fill member method.
      
      // Augment Coop Data with IPFS hash and contract address
      /*
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
      
    })
    .catch(function(err) {
      console.log(err);
    });
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
 
*/ 

