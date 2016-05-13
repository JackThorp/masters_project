import Promise    from 'bluebird';
import Collection from './Collection.js';
import userSchema from './userSchema.js';
import contracts  from '/imports/startup/contracts.js';
import User       from './User.js';

userRegistry  = Promise.promisifyAll(contracts.UserRegistry); 

// Users collection
class Users extends Collection {

  // Returns user object wrapping user data given address
  get(addr) {
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
    let registeredPromise = userRegistry.UserAddedAsync({
      _addr: addr
    });
      
    this.addToIPFS(data).then((hash) => {
      var ethHash = this.ipfsToEth(hash);
      var txObj   = this.getTxObj();
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
