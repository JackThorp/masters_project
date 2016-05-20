import { Router } from 'meteor/iron:router';
import db         from '/imports/api/db.js';

// Import UI templates so they get loaded
import '../ui/layouts/app-body.js';
import '../ui/views/welcome.js';
import '../ui/views/register.js';
import '../ui/views/home.js';
import '../ui/views/settings.js';
import '../ui/views/coops.js';
import '../ui/views/coop.js';
import '../ui/views/user.js';
import '../ui/views/search.js';

// Router defaults
Router.configure({
    layoutTemplate: 'layout_main',
    notFoundTemplate: 'layout_notFound',
    yieldRegions: {
        'layout_navbar': {to: 'navbar'}
        , 'layout_footer': {to: 'footer'}
    }
});

// ROUTES

// If session variable for user not set then
// redirect back to welcome except for on welcome and login page
//
// If session variable for user set then
// redirect to home if on welcome page or register page. 
/*
Router.onBeforeAction(function() {
 
  var routerCtx = this;
  let address = LocalStore.get('account');
  if (!Session.get('user') && address != "undefined") {
    console.log("restoring user");
    db.users.get(address).then((user) => {
      Session.set('user', user);
      console.log(user);
    })
    .catch((err) => {
      console.log(err);
      LocalStore.set('account', undefined);
    })
    .finally(function(){
      //context.next();
    });
  } else { 
    this.next();
  }
})
*/


// Default route
Router.route('/', {
  template: 'views_welcome',
  name: 'welcome'
});

Router.route('/register', {
  template: 'views_register',
  name: 'register'
});

Router.route('/home', {
  template: 'views_home',
  name: 'home'
});

Router.route('/user/:addr', {
    template: 'views_user',
    name: 'user'
});

Router.route('/search', {
  template: 'views_search',
  name: 'search'
});

Router.route('/settings', {
    template: 'views_settings',
    name: 'settings'
});

Router.route('/coops', {
    template: 'views_coops',
    name: 'coops'
});

Router.route('/coop/:id', {
  // Find the coop here and then pass in context..
  template: 'views_coop',
  name: 'coop'
});
