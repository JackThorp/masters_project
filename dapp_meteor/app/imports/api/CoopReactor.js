import _                from 'lodash';
import Promise          from 'bluebird';
import contracts        from '/imports/startup/contracts.js'; 
import EthereumReactor  from './EthereumReactor.js';
import { 
  CoopContract, 
  CoopContractCode 
}                       from '/imports/contracts/CoopContract.js';

class CoopReactor extends EthereumReactor {

  constructor(addr) {
    super();
    this.addr = addr;
  }

  // Listen for any and all membership events
  setUpListener() {
    
    let coopAddr = this.addr;
    console.log("Setting up coop reactor for: " + coopAddr);
    
    let reactor = this;
    let instance      = Promise.promisifyAll(CoopContract.at(coopAddr)); 
    instance.newMotionCreatedAsync({}).then(function(newMotionEvent) {
     
      let mId = newMotionEvent.args._mId;

      console.log("NEW MOTION EVENT (id: " + mId + ")");

      reactor.triggerDeps(mId);
    })
    .catch(function(err) {
      console.log(err)
    });

    instance.motionVoteAsync({}).then(function(voteEvent) {
     
      let mId = voteEvent.args._mId;

      console.log("NEW VOTE EVENT (id: " + mId + ")");

      reactor.triggerDeps(mId);
    })
    .catch(function(err) {
      console.log(err)
    });
  }
 
}

export default CoopReactor;
