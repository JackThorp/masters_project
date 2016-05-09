import './coop.html';
import { Router } from 'meteor/iron:router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Coops } from '/imports/api/coops.js';
import contracts from '/imports/startup/contracts.js';

Template['views_coop'].onCreated(function() {
  this.fullMembersVar = new ReactiveVar([]); 
});

Template['views_coop'].helpers({

  'coopData' : function () {
    let ipfsHash = Router.current().params.id;
    let coop = Coops.findOne({ipfsHash: ipfsHash});
    let template = Template.instance();
    coop.fillMembers(function(members) {
      template.fullMembersVar.set(members);
    });
    
    console.log(coop);
    template.thisCoop = coop;
    return coop;
  },

  'fullMembers' : function () {
    return Template.instance().fullMembersVar.get();
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
