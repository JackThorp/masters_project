import './_header.html';
import web3 from '/imports/lib/thirdparty/web3.js';

// template handlebar helper methods
Template['layout_header'].helpers({

	'address': function(){
    return web3.eth.accounts[0];
	},

  'short_address': function() {
    return web3.eth.accounts[0].substring(2,6) + "...";
  }
});
