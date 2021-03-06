import web3 from '../lib/thirdparty/web3.js';
import { LocalStore }   from 'meteor/frozeman:storage';
import { Session }      from 'meteor/session';
import { EthAccounts }  from 'meteor/ethereum:accounts';
import { EthBlocks }  from 'meteor/ethereum:blocks';
import db               from '/imports/api/db.js';
import { Router }       from 'meteor/iron:router';

// Import routes & rest of start up
import './routes.js';

// Make global for compatibility with EthAccounts etc
window.web3 = web3;

Meteor.startup(() => {

  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

  // Initialise database.
  db.init(web3);

  EthAccounts.init();
  EthBlocks.init();
  // For now - just go to home on refresh
  //Router.go('/');
  
  let userAddress = LocalStore.get('account');
  if (userAddress) {
    db.users.get(userAddress).then(function(user) {
      Session.set('user', user);
    })
    .catch(function(err) {
      LocalStore.set('account', null);
      Router.go('/');
    });
  } else {
    Router.go('/');
  }

  // SHOULD BE:
  // if local store is set then
  // get user
  // if user exists then set user in session variable logged in true
  // else account is not user
  // remove from localstorage
});
