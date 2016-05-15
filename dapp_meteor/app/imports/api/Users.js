import Promise    from 'bluebird';
import Collection from './Collection.js';
import userSchema from './userSchema.js';
import contracts  from '/imports/startup/contracts.js';
import User       from './User.js';

import MembershipReactor  from './MembershipReactor.js';
import UserReactor        from './UserReactor.js';

userRegistry  = Promise.promisifyAll(contracts.UserRegistry); 

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
    
    return userRegistry.getUserDataAsync(addr).then((hash) => {
     
      // address is not registered in userdb.
      if(hash == "0x") {
        throw new Error("user not registered"); 
      }

      // Refactor out somewhere.. . 
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
      console.log(ethHash);
      console.log(addr);
      console.log(txObj);
      return userRegistry.setUserData(addr, ethHash, txObj);
    })
    .catch(function(err){
      console.log(err);
    });

    return registeredPromise;

  }

  // Adds new user to Registry
  newUser(info) {

  }
}

export default Users;
