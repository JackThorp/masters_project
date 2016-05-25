import './search.html';
import { Router }       from 'meteor/iron:router';
import { ReactiveVar }  from 'meteor/reactive-var';
import { Tracker }      from 'meteor/tracker';
import db               from '/imports/api/db.js';
import _                from 'lodash';

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
    let query = Router.current().params.query.name;
    let qExp  = new RegExp(query);
    let filtered = _.filter(coops, function(coop) {
      return qExp.test(coop.data.name);
    });
    console.log(coops);
    return filtered;
  } 

});
