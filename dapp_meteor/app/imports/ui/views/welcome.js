import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';
import { Router }       from 'meteor/iron:router';

import './welcome.html';
import '/imports/ui/components/signUpForm.js';

Template['views_welcome'].onCreated(function() {
 
});

Template['views_welcome'].helpers({
});

Template['views_welcome'].events({
  
  'click .get-started' : function() {
    Router.go('/register');
  }
});

