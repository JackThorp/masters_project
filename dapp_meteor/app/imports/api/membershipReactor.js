import _          from 'lodash';
import Promise    from 'bluebird';
import contracts  from '/imports/startup/contracts.js'; 
import EthereumReactor from './EthereumReactor.js';

var membershipRegistry = Promise.promisifyAll(contracts.MembershipRegistry);

let instance = null;

class MembershipReactor extends EthereumReactor {
  
  constructor() {
    if (!instance) {
      super();
      instance = this;
    }
    return instance;
  }

  // Listen for any and all membership events
  setUpListener() {
    let reactor = this;
    membershipRegistry.newMembershipAsync({}).then(function(membershipEvent) {
      
      let userAddress = membershipEvent.args._member;
      let coopAddress = membershipEvent.args._coop;
      console.log("NEW MEMBER EVENT (user: " + userAddress + ", coop: " + coopAddress + ")"); 

      reactor.triggerDeps(userAddress);
      reactor.triggerDeps(coopAddress);
    })
    .catch(function(err) {
      console.log(err)
    });
  }
}

export default MembershipReactor;
