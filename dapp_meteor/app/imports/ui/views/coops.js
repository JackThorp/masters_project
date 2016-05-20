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

  // Get all this users coops.
  Tracker.autorun(function() {
    var user  = Session.get('user');
    db.users.get(user.address).then(function(user) {
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

  'user': function() {
    return Template.instance().userVar.get();
  }

});


Template['views_coops'].events({

  'submit .coop-details': function(e, template) {

    e.preventDefault();
    $('#newCoopModal').modal( 'hide' );
    
    var coopData = {
      'name': e.target.nameInput.value,
      'orgId': e.target.idInput.value,
      'terms': e.target.terms.value
    }

    var fee = web3.toWei(parseInt(e.target.feeAmount.value), "ether");
  
    db.coops.add(coopData, fee).then(function(coop) {
      let userAddress = Session.get('user').address;
      return coop.addMember(userAddress);
    })
    .catch(function(err) {
      console.log(err);
    });
  }

});

