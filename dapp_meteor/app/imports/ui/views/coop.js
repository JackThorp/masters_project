import './coop.html';
import { Router } from 'meteor/iron:router';
import { Coops } from '/imports/api/coops.js';
import contracts from '/imports/startup/contracts.js';

Template['views_coop'].onCreated(function() {
  
});

Template['views_coop'].helpers({

  'coopData' : function () {
    let ipfsHash = Router.current().params.id;
    let coop = Coops.findOne({ipfsHash: ipfsHash});
    
//    return coop.fillMembers(function(members) {
//      coop.fullMembers = members;
//    });
    
    console.log(coop);
    Template.instance().thisCoop = coop;
    return coop;
  }
});

Template['views_coop'].events({

  'click .btn-join' : function(e, template) {

    let userAddr = LocalStore.get('account');
    let coopAddr = template.thisCoop.address;

    var txObj = {
      from: web3.eth.accounts[0],
      gasPrice: web3.eth.gasPrice,
      gas: 4000000
    }

    contracts.MembershipRegistry.register(userAddr, coopAddr, txObj, function(err, txReceipt) {
      
      if(err) {
        console.log(err);
      }

      console.log("tx reciept for member registration: " + txReceipt);

    });
    
    console.log('well done'); 
  }

});
