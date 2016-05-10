import './coops.html';
import { Router }   from 'meteor/iron:router';
import { Template } from 'meteor/templating';
import { db }       from '/imports/api/db.js';
import { ReactiveVar } from 'meteor/reactive-var'

var coopsData = new ReactiveVar([]);

Template['views_coops'].onCreated(function() {
  var template = this;
  db.coops.getAll().then(function(data) {
     coopsData.set(data);         
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
  
    var coop_schema = {
      'name': e.target.nameInput.value,
      'orgId': e.target.idInput.value
    }
   
    db.coops.add(coop_schema).catch(function(err) {
      console.log(err);
    });
  }

});

