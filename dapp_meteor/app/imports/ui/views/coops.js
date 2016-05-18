import { Router }       from 'meteor/iron:router';
import { Template }     from 'meteor/templating';
import { Tracker  }     from 'meteor/tracker';
import { ReactiveVar }  from 'meteor/reactive-var'
import bs               from 'bootstrap';
import db               from '/imports/api/db.js';

import './coops.html';

Template['views_coops'].onCreated(function() {
  
  var template = this;
  this.userVar = new ReactiveVar(); 

  //TODO what if not set
  var address = LocalStore.get('account');

  // Get all this users coops.
  Tracker.autorun(function() {
    db.users.get(address).then(function(user) {
      return user.fetchCoops();
    })
    .then(function(user){
      console.log(user);
      template.userVar.set(user);
    })
    .catch(function(err) {
      console.log(err); 
    });
  });


});


Template['views_coops'].helpers({

  'coopsList' : function() {
    return [{
      name: 'Altgen'
    }, {
      name: 'Fairmondo'
    }, {
      name: 'Outlandish'
    }, {
      name: 'Cultural'
    }];
  },

  'user': function() {
    return Template.instance().userVar.get();
  }

});


Template['views_coops'].events({

  //'click .new-coop-btn': function(e, template) {
  //  Router.go('/createCoop');
  //},
  
  
  'submit .coop-details': function(e, template) {

    e.preventDefault();
  
    var coopData = {
      'name': e.target.nameInput.value,
      'orgId': e.target.idInput.value,
      'terms': e.target.terms.value
    }

    var fee = web3.toWei(parseInt(e.target.feeAmount.value), "ether");
  
    console.log(coopData);
    
    db.coops.add(coopData, fee).then(function(data) {
      console.log("New Coop Registered!");
      return ;  
    })
    .catch(function(err) {
      console.log(err);
    });
    
  }

});

