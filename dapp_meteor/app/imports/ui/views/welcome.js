import { Template } from 'meteor/templating';
import web3       from '../../lib/thirdparty/web3.js';
import contracts  from '../../startup/contracts.js';
import { db }     from '/imports/api/db.js';

import './welcome.html';

Template['views_welcome'].onCreated(function() {
  
  var template = this;
  
  //TODO what if not set
  var user = LocalStore.get('account');

  // Initialise template variables.
  TemplateVar.set('userInfo', {});
  TemplateVar.set('address', user);
   
  db.users.get(user).then(function(data) {
    return TemplateVar.set(template, 'userInfo', {found: true, user: data});
  })
  .catch(function(err) {
    console.log(err);
    return TemplateVar.set(template, 'userInfo', {error: true, msg: String(err)});
  });

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
