import { Router } from 'meteor/iron:router';


// Import UI templates so they get loaded
import '../ui/layouts/app-body.js';
import '../ui/views/welcome.js';


// Router defaults
Router.configure({
    layoutTemplate: 'layout_main',
    notFoundTemplate: 'layout_notFound',
    yieldRegions: {
        'layout_header': {to: 'header'}
        , 'layout_footer': {to: 'footer'}
    }
});

// ROUTES

// Default route
Router.route('/', {
    template: 'views_welcome',
    name: 'default'
});

Router.route('/welcome', {
    template: 'views_welcome',
    name: 'welcome'
});

