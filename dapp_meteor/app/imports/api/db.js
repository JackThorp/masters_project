import Promise    from 'bluebird';
import ipfsJs     from 'ipfs-js'; 
import contracts  from '/imports/startup/contracts.js';
import Users      from './Users.js';
import Coops      from './Coops.js';
import coopSchema from './coopSchema.js';
import userSchema from './userSchema.js';

import MembershipReactor          from './MembershipReactor.js';
import CoopRegistryReactor        from './CoopRegistryReactor.js';
import UserRegistryReactor        from './UserRegistryReactor.js';

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
    let cReactor = new CoopRegistryReactor();
    let uReactor = new UserRegistryReactor();

    // Set up listeers.
    mReactor.setUpListener();
    cReactor.setUpListener();
    uReactor.setUpListener();

    // Set up collections
    this.users = new Users(this.ipfs, web3, userSchema, mReactor, uReactor),
    this.coops = new Coops(this.ipfs, web3, coopSchema, mReactor, cReactor)
  }

  //Hex if 34 bytes - just store 32bytes and assume Qm beginning
  ipfsToEth(hash) {
    let hex = this.ipfs.utils.base58ToHex(hash);
    return '0x' +  hex.substring(4);
  }

  // 1220 is standard hex start for ipfs multihashes (sha256 with 20 character length)
  ethToIpfs(hex) {
    let fullHex = '1220' + hex.substring(2);
    return this.ipfs.utils.hexToBase58(fullHex);
  }
}

let db = new DB();
export default db;
