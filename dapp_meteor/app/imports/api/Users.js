import Promise    from 'bluebird';
import userSchema from './userSchema.js';
import contracts  from '/imports/startup/contracts.js';
userRegistry  = Promise.promisifyAll(contracts.UserRegistry); 

// TODO make a singleton ??
// Users collection
class Users {

  //TODO injection of web3
  //DB creates collection and sets handles
  constructor(ipfs) {
    this.ipfs = ipfs;
    this.schema = userSchema; 
  }

  // Returns user object wrapping user data given address
  get(addr) {
    return userRegistry.getUserDataAsync(addr).then(function(ipfsHex) {
     
      // address is not registered in userdb.
      if(ipfsHex == "0x") {
        throw new Error("user not registered"); 
      }

      // Refactor out somewhere.. . 
      ipfsHash = this.ipfs.utils.hexToBase58(ipfsHex.substring(2));

      return ipfs.catJsonAsync(ipfsHash)
    });
  }

  // Sets user data for given address
  set(addr, data) {
    
    let users = this;
    users.checkData(data);
    
    // Listen for registration event.
    let registeredPromise = userRegistry.UserAddedAsync({
      _addr: addr
    });
      
    users.addToIPFS(data).then(function(hash) {
      console.log("HASH = " + hash);
      return users.addToEth(addr, hash);
    })
    .then(function(txReceipt) {
      console.log(txReceipt);
    })
    .catch(function(err){
      console.log(err);
    });

    return registeredPromise;

  }

  // Adds new user to Registry
  newUser(info) {

  }
  
  setSchema(schema) {
    this.schema = schema;
  }

  getSchema() {
    return this.schema;
  }

  checkData(data) {    
    if(typeof this.schema === 'undefined') {
      throw new Error("Cannot set user data - no schema set!");
    };
    
    // TODO Errors not propoagating well from subschema
    if(this.schema.errors(data)) {
      console.log(this.schema.errors(data));
      throw new Error(this.schema.errors(data)); 
    };
  }

  addToIPFS(data) {
    console.log(this.ipfs);
    return this.ipfs.addJsonAsync(data);
  }
  
  addToEth(addr, hash) {
    ethHash = '0x' + this.ipfs.utils.base58ToHex(hash);
    var txObj = {
      from: web3.eth.accounts[0],
      gasPrice: web3.eth.gasPrice,
      gas: 400000
    } 
    return userRegistry.setUserData(addr, ethHash, txObj);
  }
}

export default Users;
