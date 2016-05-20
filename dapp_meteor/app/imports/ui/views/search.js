import './search.html';
import { Router }       from 'meteor/iron:router';
import { ReactiveVar }  from 'meteor/reactive-var';
import { Tracker }      from 'meteor/tracker';
import db               from '/imports/api/db.js';

Template['views_search'].onCreated(function() {

  template = this;
  template.coopsVar = new ReactiveVar([]);
  
  Tracker.autorun(function() {
    db.coops.getAll().then(function(coops) {
      template.coopsVar.set(coops);
    })
  });
});

Template['views_search'].helpers({

  'searchQuery': function() {
    let query = Router.current().params.query.name;
    return query;
  },

  'search': function(coopName) {
    let coops = Template.instance().coopsVar.get();
    console.log(coops);
    return coops;
  } 

});
