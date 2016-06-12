import Promise    from 'bluebird';
import Collection from './Collection.js';
import userSchema from './userSchema.js';
import contracts  from '/imports/startup/contracts.js';
import User       from './User.js';
import db         from './db.js';

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

    let dep = new Tracker.Dependency;
    dep.depend();
    this.userReactor.register(dep, addr);

    this.membershipReactor.register(dep, addr);

    return userController.getUserAsync(addr).then((hash) => {
     
      // address is not registered in userdb.
      if(hash == "0x0000000000000000000000000000000000000000000000000000000000000000") {
        throw new Error("user not registered"); 
      }

      ipfsHash = db.ethToIpfs(hash);
      return this.ipfs.catJsonAsync(ipfsHash)
    })
    .then((userData) => {
      return new User(addr, userData);
    });
  }

  /* Adds user data to IPFS
   * Registers user to user registry contract
   * Returns a new user object
  */
   set(addr, data) {
   
    this.checkData(data);
   
    // Listen for registration event.
    let registeredPromise = userRegistry.newUserAsync({
      _addr: addr
    });
    
    //TODO after registered should 'get' user to update
    // cache? ? 
    console.log("address: " + addr);
    console.log("data: " + data);
    this.ipfs.addJsonAsync(data).then((hash) => {
      var ethHash = db.ipfsToEth(hash);
      var txObj   = this.getTxObj();
      console.log("adding to user controller");
      return userController.addUserAsync(addr, ethHash, txObj);
    })
    .catch(function(err){
      console.log(err);
    });

    return registeredPromise.then(function(userEvent) {
      let userAddress = userEvent.args._addr;
      return new User(userAddress, data);
    });

  }
}

export default Users;
