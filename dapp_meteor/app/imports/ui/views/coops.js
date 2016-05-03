import './coops.html';
import { Coop, CoopCode } from '/imports/contracts/Coop.js';
import contracts from '/imports/startup/contracts.js';
import ipfs from 'ipfs-js';
import { Router } from 'meteor/iron:router';
import { Tempate } from 'meteor/templating';
import Helpers from '/imports/lib/helpers/helperFunctions.js';

var coopsData = [];

Template['views_coops'].onCreated(function() {
  
  var template = this;
  
  contracts.CoopRegistry.getCoops.call(function(err, coopAddresses) {
  
    // Check for error.
    if(err) {
      console.log(err);
    }  

    for(var i = 0; i < coopAddresses.length; i++) {
      Coop.at(coopAddresses[i]).getCoopData(function(err, ipfsHash) {
        if(err) {
          console.log(err);
          return;
        }
        Helpers.fromIPFS(ipfsHash, function(err, data) {
          data.ipfsHash = ipfsHash.substring(2);
          coopsData.push(data);
          TemplateVar.set(template, 'coopsList', coopsData); 
        });
      });  
    }
  }); 
});



Template['views_coops'].events({

  'click .coop-row': function(e, template) {
    console.log(e);
    console.log('/coop/' + e.currentTarget.id);
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

    // Attach listener for new user.
    contracts.CoopRegistry.newCoop({}, function(err, e) { 
      if(err) {
        console.log(err);
      }

      if(e.args._coop == newCoopAddr) {
        console.log(newCoopAddr + " successfully added to coop registry."); 
        coopsData.push(coop_schema);
        return TemplateVar.set(template, 'coopsList', coopsData);
      }
    });

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

