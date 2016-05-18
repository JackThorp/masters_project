import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';
import web3             from '../../lib/thirdparty/web3.js';
import contracts        from '../../startup/contracts.js';
import db               from '/imports/api/db.js';

import './welcome_old.html';
import '/imports/ui/components/signUpForm.js';

Template['views_welcome_old'].onCreated(function() {
  
  var template = this;
  this.userVar = new ReactiveVar(); 

  //TODO what if not set
  var address = LocalStore.get('account');

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

Template['views_welcome_old'].helpers({
  
  'user': function() {
    return Template.instance().userVar.get();
  },

});

Template['views_welcome_old'].events({

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

    var address = LocalStore.get('account');
    
    db.users.set(address, userData).then(function(user) {
      console.log('user added!');
      return TemplateVar.set(template, 'userInfo', {found: true, user: userData});
    })
    .catch(function(err) {
      console.log(err);
      return TemplateVar.set(template, 'userInfo', {error: true, msg: String(err)});
    });
  } 
});

