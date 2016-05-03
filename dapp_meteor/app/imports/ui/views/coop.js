import './coop.html';
import { Router } from 'meteor/iron:router';

Template['views_coop'].onCreated(function() {
  console.log(Router.current().params.id);
});
