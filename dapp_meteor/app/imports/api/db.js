import Promise from 'bluebird';
import ipfsJs from 'ipfs-js'; 
import contracts from '/imports/startup/contracts.js';

ipfs = Promise.promisifyAll(ipfsJs);

class DB {

  setUserData(userAddress, data) {
    let db = this;
    return db.checkUserData(data).then(function() {
      return db.addToIPFS(data);
    })
    .then(function(hash) {
      //TODO send to contract!
      console.log("hash = " + hash);
    });
  }

  checkUserData(data) {
    let db = this;
    return new Promise(function(resolve, reject) {
   
      if(typeof db.userSchema === 'undefined') {
        reject(new Error("Cannot set user data - no schema set!"));
      };
     
      if(db.userSchema.errors(data)) {
        reject(new Error(db.userSchema.errors)); 
      };
      resolve();
    });
  }


  addToIPFS(data) {
    return ipfs.addJsonAsync(data);
  }

  setUserSchema(schema) {
    this.userSchema = schema;
  }

  getUserSchema() {
    return this.userSchema;
  }
}

export default DB;
