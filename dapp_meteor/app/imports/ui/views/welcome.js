import { Template } from 'meteor/templating';
import { ipfsAPI } from 'ipfs-api';

import './welcome.html';

/*
Template['views_welcome'].onCreated(function() {
	  //Meta.setSuffix(TAPi18n.__("dapp.home.title"));
    accounts = EthAccounts.find();
});

Template['views_welcome'].rendered = function() {
  
  var template = this;

  var user = web3.eth.accounts[0];
  console.log(user);
  
  // Initialise template variables.
  TemplateVar.set('userInfo', {});

  objects.contracts.UserRegistry.getUserData(user, function(err, result) {
    
    // Check for error.
    if(err) {
      return TemplateVar.set(template, 'userInfo', {error: true, msg: String(err)});
    }

    // 'Current user' is not yet registered in userdb.
    // For some reason result is coming back as "0x" string.
    if(result == "0x") {
      console.log('Not yet registered');
      return TemplateVar.set(template, 'userInfo', {});
    }

    // 'current user' is registered in userdb.
    if(result != "0x") {
      var name =  web3.toAscii(result).replace(/\u0000/g, '');
      console.log('Name = ' + name );
      return TemplateVar.set(template, 'userInfo', {found: true, data: name});
    }
   
  }); 

};



// TODO Fetch basic user info from storage?
Template['views_welcome'].helpers({
 
  //TODO set this in local storage?
  userAddress: function() {
    return web3.eth.defaultAccount;
  },

});




//TODO Create User Button!!!
Template['views_welcome'].events({

  
  'click .btn-create': function(e, template) {
    
  },


  // Event for User Registration
  'click .btn-register': function(e, template) {

    // Attach listener for new user.
    objects.contracts.UserRegistry.UserAdded({}, function(err, res) { 
      if(err) {
        console.log(err);
        return TemplateVar.set(template, 'userInfo', {error: true, msg: String(err)});
      }
      
      console.log('newUser event fired');
      console.log(res);

      // Will probably need to format the returned values. Helper function maybe at some point.
      TemplateVar.set(template, 'userInfo', {error: false, found: true, data: res});
    });
    
    var txObject = {
      from: web3.eth.defaultAccount,
      gasPrice: web3.eth.gasPrice,
      gas: 4000000
    }
   
    // Get coop name from input field.
    var name = $('#user-name').val();
    var user = web3.eth.accounts[0];

    var ipfs_hash = '';
    var user_schema = {
      'name': name
    }

    ipfs.addJson(user_schema, function(err, res) {
      if (err) {
        console.log("ERROR: " + err);
      }
      if (res) {
        ipfs_hash = '0x' + ipfs.utils.base58ToHex(res);
       
        console.log(ipfs_hash);

        // Register the current default account with the given name.
        objects.contracts.UserRegistry.setUserData(user, ipfs_hash, txObject, function(err, res) {
          if(err) {
            console.log(err);
            return TemplateVar.set(template, 'userInfo', {error: true, msg: String(err)});
          } 
          console.log('setUserData tx receipt: ' + res);
        });
      }
    });
    
    
  }

});
*/
