import _          from 'lodash';
import Promise    from 'bluebird'
import contracts  from '/imports/startup/contracts.js';
import db         from '/imports/api/db.js';

var membershipRegistry = Promise.promisifyAll(contracts.MembershipRegistry);

 
class User {
  
  constructor(addr, userData) {
    this.address = addr;
    this.data = userData;
  }

  // Gets coops user is member of
  fetchCoops() {
    let user = this;
    return membershipRegistry.getCoopsAsync(this.address).then(function(coopAddresses) {
      
      var coopPromises = [];
      //console.log(memberAddresses);
      for(var i = 0; i < coopAddresses.length; i++) {
        
        // Use reflect to implement settle all 
        coopPromises.push(db.coops.get(coopAddresses[i]).reflect());
      }
      return Promise.all(coopPromises);
    })
    .filter(function(coopPromise) {
      return coopPromise.isFulfilled();
    })
    .map(function(coopPromise){
      return coopPromise.value();
    })
    .then(function(coops) {
      user.coops = coops;
      return user;
    });
  }
}

export default User;
