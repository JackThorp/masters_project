import { Router } from 'meteor/iron:router';


// Import UI templates so they get loaded
import '../ui/layouts/app-body.js';
import '../ui/views/welcome.js';
import '../ui/views/home.js';
import '../ui/views/settings.js';
import '../ui/views/coops.js';
import '../ui/views/createCoop.js';
import '../ui/views/coop.js';

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

// Default route
Router.route('/', {
    template: 'views_welcome',
    name: 'default'
});

Router.route('/home', {
  template: 'views_home',
  name: 'home'
});

Router.route('/createCoop', {
  template: 'views_createCoop',
  name: 'createCoop'
});

Router.route('/welcome_old', {
    template: 'views_welcome_old',
    name: 'welcome'
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
  template: 'views_coop',
  name: 'coop'
});
