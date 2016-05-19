import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';
import { EthAccounts }  from 'meteor/ethereum:accounts';
import { Router }       from 'meteor/iron:router';
import web3             from '../../lib/thirdparty/web3.js';
import contracts        from '../../startup/contracts.js';
import db               from '/imports/api/db.js';

import './register.html';

Template['views_register'].onCreated(function() {
  
  var template = this;
  template.accountsVar = new ReactiveVar([]);
  // If account is set from previous session?
  var accounts = EthAccounts.find().fetch();

  Tracker.autorun(function() {
    // Check to see if account is registered.
    var userPromises = [];
    _.forEach(accounts, function(account) {
      userPromises.push(db.users.get(account.address).reflect());
    });
    Promise.all(userPromises).then(function(values) {
      return values.filter(function(userPromise) {
        return userPromise.isFulfilled();
      })
      .map(function(userPromise) {
        return userPromise.value();
       })
    })
    .then(function(users) {
      console.log(users);
      template.accountsVar.set(users);
    })
    .catch(function(err) {
      console.log(err);
    });
  });

});

Template['views_register'].helpers({
  
  'user': function() {
    return Template.instance().userVar.get();
  },

  'registeredAccounts': function() {
    return Template.instance().accountsVar.get();
  },

  'accounts': function() {
    let registered  = Template.instance().accountsVar.get();
    let accounts    = EthAccounts.find().fetch();
    registered = _.map(registered, function(account) {
      return account.address;
    });
    accounts =  _.map(accounts, function(account) {
      return account.address;
    });
    let diff = _.difference(accounts, registered);
    console.log(diff);
    return diff
  }

});

Template['views_register'].events({

  'click .account-wrapper': function(e, template) {
    
    let address = e.currentTarget.dataset.address;
    let users = template.accountsVar.get();
    let user = _.find(users, function(user) {
      return user.address == address;
    });

    console.log("Setting account to: " + user.address);
    LocalStore.set('account', user.address);
    Session.set('user', user);
    Router.go('/home');
  },

  // Event for User Registration
  'submit .user-details': function(e, template) {

    e.preventDefault();

    var userData = {
      'name': e.target.userName.value,
      'email': e.target.userEmail.value,
    }

    let select = e.target.account;
    let address = select.options[select.selectedIndex].value;
   
    // Add user to user databae
    db.users.set(address, userData).then(function(user) {
      //TODO this is tx receipt - not the user!!
      console.log('user added!');
      LocalStore.set('account', user.address);
      Session.set('user', user);
      Router.go('/home');
    })
    .catch(function(err) {
      console.log(err);
    });
    
  } 
});

