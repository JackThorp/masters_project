import './_navbar.html';
import web3 from '/imports/lib/thirdparty/web3.js';
import { LocalStore }   from 'meteor/frozeman:storage';
import { Session }      from 'meteor/session';
import bs               from 'bootstrap';
import db               from '/imports/api/db.js';

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
    return Session.get('user');
  },
	
  'address': function(){
    return { addr: LocalStore.get('account')};
	},

  'short_address': function() {
    return LocalStore.get('account').toString().substring(2,6) + "...";
  }

});

Template['layout_navbar'].events({

  'submit .navbar-form': function(e, template) {
    e.preventDefault()
    let query = e.target.searchQuery.value;
    Router.go('search', {}, {query: 'name='+query});
  }
});
