import './accounts.html';
import web3 from '/imports/lib/thirdparty/web3.js'; 
import { LocalStore }   from 'meteor/frozeman:storage';
import { EthAccounts }  from 'meteor/ethereum:accounts';

// when the template is rendered
Template["components_accounts"].onRendered(function(){
});

// template events
Template['components_accounts'].events({

  'click .accounts-row': function(e, template) {
    var newAccount = $(e.target).closest('tr').data('address');
    var change = confirm("Are you sure you want to switch to account: " + newAccount + "?");
    
    if(change) {
      LocalStore.set('account', newAccount);
      web3.eth.defaultAccount = newAccount;
    }
  }

});

// template handlebar helper methods
Template['components_accounts'].helpers({
	/**
    Convert Wei to Ether Values

    @method (fromWei)
    */

	'fromWei': function(weiValue, type){
		return web3.fromWei(weiValue, type).toString(10);
	},

	/**
    Get Eth Accounts

    @method (accounts)
    */

	'accounts': function(){
    return EthAccounts.find({}).fetch();
	},
});
