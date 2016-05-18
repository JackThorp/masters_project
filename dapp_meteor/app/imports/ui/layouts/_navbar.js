import './_navbar.html';
import web3 from '/imports/lib/thirdparty/web3.js';
import { LocalStore }   from 'meteor/frozeman:storage';


Template['layout_navbar'].onCreated(function(){

  // get account.
  // If Empty of no User Associated with the current account.
  // THEN only sign in 
  // ELSE
  // Present logged in navbar
});

// template handlebar helper methods
Template['layout_navbar'].helpers({

  'loggedIn': function() {
    return true;
  },
	
  'address': function(){
    return LocalStore.get('account');
	},

  'short_address': function() {
    return LocalStore.get('account').toString().substring(2,6) + "...";
  }
});
