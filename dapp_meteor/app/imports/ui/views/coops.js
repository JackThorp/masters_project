import './coops.html';
import { Router }   from 'meteor/iron:router';
import { Template } from 'meteor/templating';
import { Tracker  } from 'meteor/tracker';
import db           from '/imports/api/db.js';
import { ReactiveVar } from 'meteor/reactive-var'

var coopsData = new ReactiveVar([]);

Template['views_coops'].onCreated(function() {
  var template = this;
 
  Tracker.autorun(function() {
    console.log("RERUNNING!");
    db.coops.getAll().then(function(data) {
      coopsData.set(data);         
      console.log(data);
    });
  });
 
});


Template['views_coops'].helpers({

  'coopsList' : function() {
    return coopsData.get();
  }

});


Template['views_coops'].events({

  'click .coop-row': function(e, template) {
    Router.go('/coop/' + e.currentTarget.id);
  },
  
  
  'submit .coop-details': function(e, template) {

    e.preventDefault();
  
    var coopData = {
      'name': e.target.nameInput.value,
      'orgId': e.target.idInput.value,
      'terms': e.target.terms.value,
      'fee'  : parseInt(e.target.feeAmount.value)
    }
  
    console.log(coopData);
    
    db.coops.add(coopData).then(function(data) {
      console.log("New Coop Registered!");
      console.log(data);  
    })
    .catch(function(err) {
      console.log(err);
    });
    
  }

});

