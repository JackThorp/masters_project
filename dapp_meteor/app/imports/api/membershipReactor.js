import _          from 'lodash';
import Promise    from 'bluebird';
import contracts  from '/imports/startup/contracts.js'; 

var membershipRegistry = Promise.promisifyAll(contracts.MembershipRegistry);

class MembershipReactor {

  constructor() {
    this.deps = {};
    this.setUpListener();
  }

  // Listen for any and all membership events
  setUpListener() {
    console.log("setting up listener");
    membershipRegistry.newMembershipAsync({}).then(function(membershipEvent) {
      console.log(membershipEvent);
      var userAddress = membershipEvent.args._member;
      var coopAddress = membershipEvent.args._coop;

      this.triggerDeps(userAddress);
      this.triggerDeps(coopAddress);
    })
    .catch(function(err) {
      console.log(err)
    });
  }

  // Trigger all registered dependencies for given address
  triggerDeps(address) {
    if (!this.deps[address]) return;

    _.forEach(this.deps[userAddress], function(dep) {
      dep.changed();
    });
  }

  // coop or user attaches dependency to 
  // their events on their ethereum address
  register(address, dependency) {
    if (!this.deps[address]) {
      this.deps[address] = [];
    }

    this.deps[address].push(dependency);
  }

}

let membershipReactor = new MembershipReactor();

export default membershipReactor;
