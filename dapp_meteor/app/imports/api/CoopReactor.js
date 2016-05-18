import _          from 'lodash';
import Promise    from 'bluebird';
import contracts  from '/imports/startup/contracts.js'; 
import EthereumReactor from './EthereumReactor.js';

var coopRegistry = Promise.promisifyAll(contracts.CoopRegistry);

class CoopReactor extends EthereumReactor {

  // Listen for any and all membership events
  setUpListener() {
    console.log("Setting up coop reactor listener");
    let reactor = this;
    coopRegistry.newCoopAsync({}).then(function(newCoopEvent) {
     
      let coopAddress = newCoopEvent.args._coop;
      console.log("NEW COOP EVENT (coop: " + coopAddress + ")");

      reactor.triggerDeps(coopAddress);
    })
    .catch(function(err) {
      console.log(err)
    });
  }
 
}

export default CoopReactor;
