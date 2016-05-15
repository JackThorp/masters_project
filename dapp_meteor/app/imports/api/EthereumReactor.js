import _          from 'lodash';
import Promise    from 'bluebird';

class EthereumReactor {

  constructor() {
    this.deps = {
      all: []
    };
    this.setUpListener();
  }

  // Overriddern by contract reactors
  setUpListener() {

  }

  // Trigger all registered dependencies for given address
  triggerDeps(address) {
   
    _.forEach(this.deps.all, function(dep){
      dep.changed();
    });

    if (!this.deps[address]) return;
    
    _.forEach(this.deps[address], function(dep) {
      console.log(dep);
      dep.changed();
    });
  }

  // coop or user attaches dependency to 
  // their events on their ethereum address
  register(dependency, address) {
    
    if (!address) {
      this.deps.all.push(dependency);
      return
    }

    if (!this.deps[address]) {
      this.deps[address] = [];
    }

    this.deps[address].push(dependency);
  }


  /*
  // Listen for any and all membership events
  setUpListener(listeners) {
    _.forEach(listeners, this.addListener);
  }

  registerListener(listener) {
    let reactor = this;
    listener.then(function(adresses) {
      _.forEach(addresses, reactor.triggerDeps);
    })
    .catch(function(err) {
      console.log(err);
    });
  }
*/
}

export default EthereumReactor;
