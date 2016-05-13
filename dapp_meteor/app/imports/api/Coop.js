import _          from 'lodash';
import Promise    from 'bluebird'
import contracts  from '/imports/startup/contracts.js';
import db         from '/imports/api/db.js';

var membershipRegistry = Promise.promisifyAll(contracts.MembershipRegistry);

class Coop {

  constructor(addr, data) {
    this.data = data;
    this.address = addr;
  }
  
  // Add member when user joins the cooperative
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
      //console.log(memberAddresses);
      for(var i = 0; i < memberAddresses.length; i++) {
        
        // Use reflect to implement settle all 
        memberPromises.push(db.users.get(memberAddresses[i]).reflect());
      }
      return Promise.all(memberPromises);
    })
    .filter(function(memberPromise) {
      console.log(memberPromise);
      return memberPromise.isFulfilled();
    })
    .map(function(memberPromise){
      return memberPromise.value();
    })
    .then(function(members) {
      //console.log(members);
      coop.members = members;
      return coop;
    });
  }

  // Validates coop (only works for Coops UK account)
  authorise() {

  }
}

export default Coop;
