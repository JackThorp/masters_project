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
    instance.newProposalCreatedAsync({}).then(function(newProposalEvent) {
     
      let pId = newProposalEvent.args._pId;

      console.log("NEW PROPOSAL EVENT (id: " + pId + ")");

      reactor.triggerDeps(pId);
    })
    .catch(function(err) {
      console.log(err)
    });

    instance.proposalVoteAsync({}).then(function(voteEvent) {
     
      let pId = voteEvent.args._pId;

      console.log("NEW VOTE EVENT (id: " + pId + ")");

      reactor.triggerDeps(pId);
    })
    .catch(function(err) {
      console.log(err)
    });

    instance.proposalPassedAsync({}).then(function(closeEvent) {

      let pId = closeEvent.args._pId;
      console.log("PROPOSAL PASSED: " + pId);
      reactor.triggerDeps(pId);
    })
    .catch(function(err) {
      console.log(err);
    });

    instance.proposalDefeatedAsync({}).then(function(closeEvent) {

      let pId = closeEvent.args._pId;
      console.log("PROPOSAL DEFEATED: " + pId);
      reactor.triggerDeps(pId);
    })
    .catch(function(err) {
      console.log(err);
    });
  }
 
}

export default CoopReactor;
