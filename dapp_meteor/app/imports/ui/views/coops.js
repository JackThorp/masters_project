import { Router }       from 'meteor/iron:router';
import { Template }     from 'meteor/templating';
import { Tracker  }     from 'meteor/tracker';
import { ReactiveVar }  from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import bs               from 'bootstrap';
import db               from '/imports/api/db.js';

import './coops.html';
import '/imports/ui/components/waitModal.js';

Template['views_coops'].onCreated(function() {
  
  var template = this;
  this.userVar = new ReactiveVar();
  this.formSliders = new ReactiveDict();
  this.formSliders.set('quorum', 50);
  this.formSliders.set('normal', 50);
  this.formSliders.set('extra', 50);

  // Get all this users coops.
  Tracker.autorun(function() {
    var user  = Session.get('user');
    if (user && user.address) {
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
    }
  });

});


Template['views_coops'].helpers({

  'user': function() {
    return Template.instance().userVar.get();
  },

  'sliderValue': function(sliderName) {
    return Template.instance().formSliders.get(sliderName);
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

    var fee = web3.toWei(Number(e.target.feeAmount.value), "ether");
    var quorum = e.target.quorum.value;
    var nRes   = e.target.normal.value;
    var eRes   = e.target.extra.value;
    
    $('#wait-modal').modal('show');

    db.coops.add(coopData, fee, quorum, nRes).then(function(coop) {
      let userAddress = Session.get('user').address;
      return coop.addMember(userAddress);
    })
    .then(function(coop) {
      $('#wait-modal').modal('hide');
    })
    .catch(function(err) {
      console.log(err);
    });
    
  },

  'input .slider-input': function(e, template) {
    let nv = e.currentTarget.value;
    let slider = e.currentTarget.id;
    let sliderVals = template.formSliders.set(slider, nv);
  }

});

