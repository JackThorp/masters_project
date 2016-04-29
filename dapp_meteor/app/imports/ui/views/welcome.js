import { Template } from 'meteor/templating';
import web3       from '../../lib/thirdparty/web3.js';
import contracts  from '../../startup/contracts.js';
import ipfs from 'ipfs-js';

import './welcome.html';

function getDataFromIPFS(ipfsHash, cb) {
  
  // Drop the 0x
  ipfsHash = ipfs.utils.hexToBase58(ipfsHash.substring(2));
  ipfs.catJson(ipfsHash, cb);
}

Template['views_welcome'].onCreated(function() {
    //accounts = EthAccounts.find();
});

Template['views_welcome'].rendered = function() {
  
  var template = this;
  var user = web3.eth.accounts[0];
  
  // Initialise template variables.
  TemplateVar.set('userInfo', {});

  contracts.UserRegistry.getUserData(user, function(err, ipfsHex) {
    
    // Check for error.
    if(err) {
      return TemplateVar.set(template, 'userInfo', {error: true, msg: String(err)});
    }

    // 'Current user' is not yet registered in userdb.
    if(ipfsHex == "0x") {
      return TemplateVar.set(template, 'userInfo', {});
    }

    getDataFromIPFS(ipfsHex, function(err, data) {
      return TemplateVar.set(template, 'userInfo', {found: true, data: data});
    });
  }); 

};


/*
// TODO Fetch basic user info from storage?
Template['views_welcome'].helpers({
 
  //TODO set this in local storage?
  userAddress: function() {
    return web3.eth.defaultAccount;
  },

});

*/


//TODO Create User Button!!!
Template['views_welcome'].events({

  'updateUser': function(e, template, ipfsHash) {
    console.log("YO " + ipfsHash);
  },

  'click .btn-create': function(e, template) {
    
  },


  // Event for User Registration
  'click .btn-register': function(e, template) {

    var txObject = {
      from: web3.eth.accounts[0],
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
    
    // Attach listener for new user.
    contracts.UserRegistry.UserAdded({}, function(err, userAddr) { 
      if(err) {
        return TemplateVar.set(template, 'userInfo', {error: true, msg: String(err)});
      }
      
      return TemplateVar.set(template, 'userInfo', {found: true, data: user_schema});
    });

    ipfs.addJson(user_schema, function(err, res) {
      if (err) {
        console.log("ERROR: " + err);
      }
      if (res) {
        ipfs_hash = '0x' + ipfs.utils.base58ToHex(res);
       
        console.log("IPFS HASH: " + ipfs_hash);
  
        console.log("User: " + user);
        // Register the current default account with the given name.
        contracts.UserRegistry.setUserData(user, ipfs_hash, txObject, function(err, res) {
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

