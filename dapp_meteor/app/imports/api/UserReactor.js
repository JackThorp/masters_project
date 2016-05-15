import _          from 'lodash';
import Promise    from 'bluebird';
import contracts  from '/imports/startup/contracts.js'; 
import EthereumReactor from './EthereumReactor.js';

var userRegistry = Promise.promisifyAll(contracts.UserRegistry);

let instance = null;

class UserReactor extends EthereumReactor {

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
    userRegistry.newUserAsync({}).then(function(newUserEvent) {
      
      let userAddress = newUserEvent.args._addr;
      reactor.triggerDeps(userAddress);
    })
    .catch(function(err) {
      console.log(err)
    });
  }
}

export default UserReactor;

/*
import Promise          from 'bluebird';
import contracts        from '/imports/startup/contracts.js';

userRegistry = Promise.promisifyAll(contracts.UserRegistry);

let userListener = userRegistry.newUserAsync({}).then(function(newUserEvent) {
  let addresses = [];
  addresses.push(newUserEvent.args._addr);
  return addresses;
});

export default userListener;
*/
