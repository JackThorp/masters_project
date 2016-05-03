import './_header.html';
import web3 from '/imports/lib/thirdparty/web3.js';
import { LocalStore }   from 'meteor/frozeman:storage';

// template handlebar helper methods
Template['layout_header'].helpers({

	'address': function(){
    return LocalStore.get('account');
	},

  'short_address': function() {
    return LocalStore.get('account').toString().substring(2,6) + "...";
  }
});
