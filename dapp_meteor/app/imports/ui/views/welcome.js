import { Template } from 'meteor/templating';
import web3       from '../../lib/thirdparty/web3.js';
import contracts  from '../../startup/contracts.js';
import ipfs from 'ipfs-js';
import Helpers from '/imports/lib/helpers/helperFunctions.js';

import './welcome.html';

Template['views_welcome'].onCreated(function() {
  
  var template = this;
  
  //TODO what if not set
  var user = LocalStore.get('account');

  // Initialise template variables.
  TemplateVar.set('userInfo', {});
  TemplateVar.set('address', user);
    
  contracts.UserRegistry.getUserData(user, function(err, ipfsHex) {
    
    // Check for error.
    if(err) {
      console.log(err);
      return TemplateVar.set(template, 'userInfo', {error: true, msg: String(err)});
    }

    // 'Current user' is not yet registered in userdb.
    if(ipfsHex == "0x") {
      return TemplateVar.set(template, 'userInfo', {found: false});
    }

    Helpers.fromIPFS(ipfsHex, function(err, data) {
      return TemplateVar.set(template, 'userInfo', {found: true, user: data});
    });
  }); 

});


Template['views_welcome'].events({

  // Event for User Registration
  'submit .user-details': function(e, template) {

    e.preventDefault();
 
    //TODO test setting to localstore.get accounts
    var txObject = {
      from: web3.eth.accounts[0],
      gasPrice: web3.eth.gasPrice,
      gas: 4000000
    }
   
    var ipfs_hash = '';
    // TODO parsley form validation
    
    var user_schema = {
      'name': e.target.nameInput.value,
      'email': e.target.emailInput.value,
      'address': {
        'line1': e.target.addressInput1.value,
        'line2': e.target.addressInput2.value,
        'city': e.target.addressInput3.value,
        'postCode': e.target.addressInput4.value,
        'country': e.target.countryInput.value
      }
    }
   
    console.log(user_schema);

    // Attach listener for new user.
    contracts.UserRegistry.UserAdded({}, function(err, userAddr) { 
      if(err) {
        return TemplateVar.set(template, 'userInfo', {error: true, msg: String(err)});
      }
     
      console.log('user added!');
      return TemplateVar.set(template, 'userInfo', {found: true, user: user_schema});
    });

    ipfs.addJson(user_schema, function(err, res) {
      if (err) {
        console.log("ERROR: " + err);
      }
      
      ipfs_hash = '0x' + ipfs.utils.base58ToHex(res);
     
      console.log("User IPFS hash: " + ipfs_hash);
      
      var user = TemplateVar.get(template, 'address');
      
      // Register the current default account with the given name.
      contracts.UserRegistry.setUserData(user, ipfs_hash, txObject, function(err, res) {
        if(err) {
          console.log(err);
          return TemplateVar.set(template, 'userInfo', {error: true, msg: String(err)});
        } 
        console.log('setUserData tx receipt: ' + res);
      });
    });

  }

});

