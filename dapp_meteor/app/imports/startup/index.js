import './routes.js';

import { Accounts } from 'meteor/frozeman:accounts';
import { Web3 }     from 'meteor/ethereum:web3';
import { ipfsAPI }  from 'ipfs-api';

Meteor.startup(() => {
  
  var web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

  var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'});
  
  console.log(web3);
  console.log(ipfs);

});
