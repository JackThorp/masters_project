// Load web3 & ipfs objects
import web3 from '../lib/thirdparty/web3.js';
import ipfs from 'ipfs-js';
import { LocalStore }   from 'meteor/frozeman:storage';
import { EthAccounts } from 'meteor/ethereum:accounts';

// Import routes & rest of start up
import './routes.js';

// Make global for compatibility with EthAccounts etc
window.web3 = web3;

Meteor.startup(() => {
  
  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

  ipfs.setProvider({host: 'localhost', port: '5001'})

  EthAccounts.init();

  if(!LocalStore.get('account')) {
    LocalStore.set('account', web3.eth.accounts[0]);
  }
});
