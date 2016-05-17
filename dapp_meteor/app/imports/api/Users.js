import Promise    from 'bluebird';
import Collection from './Collection.js';
import userSchema from './userSchema.js';
import contracts  from '/imports/startup/contracts.js';
import User       from './User.js';

import MembershipReactor  from './MembershipReactor.js';
import UserReactor        from './UserReactor.js';

userController  = Promise.promisifyAll(contracts.UserController); 
userRegistry    = Promise.promisifyAll(contracts.UserRegistry); 
cmc             = Promise.promisifyAll(contracts.CMC);

// Users collection
class Users extends Collection {

  constructor(ipfs, web3, schema, membershipReactor, userReactor) {
    super(ipfs, web3, schema);
    this.membershipReactor  = membershipReactor;
    this.userReactor        = userReactor;
  }

  // Returns user object wrapping user data given address
  get(addr) {

    // Should react to changes to user with address
    let dep = new Tracker.Dependency;
    dep.depend();
    this.membershipReactor.register(dep, addr);
    this.userReactor.register(dep, addr);

    return userController.getUserAsync(addr).then((hash) => {
     
      // address is not registered in userdb.
      if(hash == "0x0000000000000000000000000000000000000000000000000000000000000000") {
        throw new Error("user not registered"); 
      }

      ipfsHash = this.ethToIpfs(hash);
      return this.ipfs.catJsonAsync(ipfsHash)
    })
    .then((userData) => {
      return new User(addr, userData);
    });
  }

  // Sets user data for given address
  set(addr, data) {
   
    this.checkData(data);
   
    // Listen for registration event.
    let registeredPromise = userRegistry.newUserAsync({
      _addr: addr
    });
    
    //TODO after registered should 'get' user to update
    // cache? ? 

    this.addToIPFS(data).then((hash) => {
      var ethHash = this.ipfsToEth(hash);
      var txObj   = this.getTxObj();
      return userController.addUserAsync(addr, ethHash, txObj);
    })
    .catch(function(err){
      console.log(err);
    });

    return registeredPromise;

  }
}

export default Users;
