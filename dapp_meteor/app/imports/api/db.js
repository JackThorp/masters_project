import Promise    from 'bluebird';
import ipfsJs     from 'ipfs-js'; 
import contracts  from '/imports/startup/contracts.js';
//import web3       from '/imports/lib/thirdparty/web3.js';
import Users      from './Users.js';
import Coops      from './Coops.js';

ipfs          = Promise.promisifyAll(ipfsJs);
//userRegistry  = Promise.promisifyAll(contracts.UserRegistry); 

class DB {

  constructor(config) {
    ipfs.setProvider({host: 'localhost', port: '5001'});
    this.users = new Users(ipfs);
    this.coops = new Coops(ipfs);
  }

}

export let db = new DB();
