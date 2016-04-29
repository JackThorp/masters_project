// Load web3 & ipfs objects
import web3 from '../lib/thirdparty/web3.js';
import ipfs from 'ipfs-js';

// Import routes & rest of start up
import './routes.js';

// Global variables from imported files are availble here
// but not vice versa. 
// How to share a global variable?

Meteor.startup(() => {
  
  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

  ipfs.setProvider({host: 'localhost', port: '5001'})

});
