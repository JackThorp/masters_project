import './coop.html';
import { Router } from 'meteor/iron:router';
import { ReactiveVar } from 'meteor/reactive-var';
import contracts from '/imports/startup/contracts.js';
import { db } from '/imports/api/db.js';

Template['views_coop'].onCreated(function() {
  let template = this;

  template.fullMembersVar = new ReactiveVar([]); 
  template.coop = new ReactiveVar({});

  template.address = Router.current().params.id;
  db.coops.get(template.address).then(function(coop) {
    console.log(coop);
    return coop.fetchMembers();
  })
  .then(function(coop) {
    console.log(coop);
    template.coop.set(coop);
  })
  .catch(function(err){
    console.log(err)
  });
});

Template['views_coop'].helpers({

  'coopData' : function () {
    let address = Router.current().params.id;
     
    let template = Template.instance();
    return template.coop.get();
  }

});

Template['views_coop'].events({

  'click .btn-join' : function(e, template) {

    let userAddr = LocalStore.get('account');
    let coopAddr = template.address;

    /*
    db.coops.get(coopAddr).addMember(userAddr).then(function(data) {
      console.log(data);
    });
    */
    db.coops.get(coopAddr).then(function(coop){
      return coop.addMember(userAddr);
    }).then(function(data) {
      console.log(data);
    });

  }

});

