import Promise    from 'bluebird';
import ipfsJs     from 'ipfs-js'; 
import contracts  from '/imports/startup/contracts.js';
import Users      from './Users.js';
import Coops      from './Coops.js';
import coopSchema from './coopSchema.js';
import userSchema from './userSchema.js';

import MembershipReactor  from './MembershipReactor.js';
import CoopReactor        from './CoopReactor.js';
import UserReactor        from './UserReactor.js';

var ipfs          = Promise.promisifyAll(ipfsJs);

class DB {

  constructor(config) {
    ipfs.setProvider({host: 'localhost', port: '5001'});
    this.ipfs = ipfs;
  }

  init(web3) {
    if (!web3.currentProvider) {
      throw new Error('web3 provider must be set before initialising database!');
    }
    // Set up Ethereum reactors. 
    let mReactor = new MembershipReactor(); 
    let cReactor = new CoopReactor();
    let uReactor = new UserReactor();

    // Set up collections
    this.users = new Users(this.ipfs, web3, userSchema, mReactor, uReactor),
    this.coops = new Coops(this.ipfs, web3, coopSchema, mReactor, cReactor)
  }
}

let db = new DB();
export default db;
