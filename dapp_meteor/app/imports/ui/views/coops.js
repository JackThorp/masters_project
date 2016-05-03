import './coops.html';
import { Coop, CoopCode } from '/imports/contracts/Coop.js';
import contracts from '/imports/startup/contracts.js';
import ipfs from 'ipfs-js';
import { Router } from 'meteor/iron:router';
import { Tempate } from 'meteor/templating';
import Helpers from '/imports/lib/helpers/helperFunctions.js';
import { Coops } from '/imports/api/coops.js';

var coopsData = [];

Template['views_coops'].onCreated(function() {
  var template = this;
});


Template['views_coops'].helpers({

  'coopsList' : function() {
    return Coops.find({}).fetch();
  }

});


Template['views_coops'].events({

  'click .coop-row': function(e, template) {
    Router.go('/coop/' + e.currentTarget.id);
  },
  
  
  'submit .coop-details': function(e, template) {

    e.preventDefault();
  
    var coop_schema = {
      'name': e.target.nameInput.value,
      'orgId': e.target.idInput.value
    }

    var txObject = {
      from: web3.eth.accounts[0],
      gasPrice: web3.eth.gasPrice,
      gas: 4000000
    }
    
    var newCoopAddr = '';
   
    // TODO make this into insert method on Coops. . . 
    ipfs.addJson(coop_schema, function(err, res) {
      if (err) {
        console.log(err);
        return;
      }
      
      ipfs_hash = '0x' + ipfs.utils.base58ToHex(res);
      console.log("Coop IPFS hash: " + ipfs_hash);  
      txObject.data = CoopCode;

      Coop.new(ipfs_hash, txObject, function(err, newCoop) {
          
        if(err) {
          console.log(err);
          return;
        }

        if(newCoop.address) {
          newCoopAddr = newCoop.address;
          contracts.CoopRegistry.addCoop(newCoop.address, txObject, function(err, res) {
            if(err) {
              console.log(err);
            } 
            console.log('addCoop tx receipt: ' + res);
          });
        }
      });

    });          
  }

});

