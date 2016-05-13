import Promise    from 'bluebird';
import ipfsJs     from 'ipfs-js'; 
import contracts  from '/imports/startup/contracts.js';
import web3       from '/imports/lib/thirdparty/web3.js';
import Users      from './Users.js';
import Coops      from './Coops.js';
import coopSchema from './coopSchema.js';
import userSchema from './userSchema.js';

var ipfs          = Promise.promisifyAll(ipfsJs);

class DB {

  constructor(config) {
    console.log(ipfs.setProvider);
    ipfs.setProvider({host: 'localhost', port: '5001'});
    this.users = new Users(ipfs, web3, userSchema);
    this.coops = new Coops(ipfs, web3, coopSchema);
  }

}

export let db = new DB();
