import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import web3       from '../../lib/thirdparty/web3.js';
import contracts  from '../../startup/contracts.js';
import db         from '/imports/api/db.js';

import './welcome.html';

Template['views_welcome'].onCreated(function() {
  
  var template = this;
  template.userVar = new ReactiveVar({}); 

  //TODO what if not set
  var address = LocalStore.get('account');

  db.users.get(address).then(function(user) {
    return user.fetchCoops();
  })
  .then(function(user){
    TemplateVar.set(template, 'found', true);
    template.userVar.set(user);
  })
  .catch(function(err) {
    console.log(err);
    TemplateVar.set(template, 'found', false);
  });

});

Template['views_welcome'].helpers({
  
  'user': function() {
    let template = Template.instance();
    return template.userVar.get();
  }

});

Template['views_welcome'].events({

  // Event for User Registration
  'submit .user-details': function(e, template) {

    e.preventDefault();

    var userData = {
      'name': e.target.nameInput.value,
      'email': e.target.emailInput.value,
      'address': {
        'line1': e.target.addressInput1.value,
        'line2': e.target.addressInput2.value,
        'city': e.target.addressInput3.value,
        'postcode': e.target.addressInput4.value,
        'country': e.target.countryInput.value
      }
    }

    var user = TemplateVar.get(template, 'address');
    
    db.users.set(user, userData).then(function(user) {
      console.log('user added!');
      return TemplateVar.set(template, 'userInfo', {found: true, user: userData});
    })
    .catch(function(err) {
      console.log(err);
      return TemplateVar.set(template, 'userInfo', {error: true, msg: String(err)});
    });
  } 
});

