import './coop.html';
import { Router }       from 'meteor/iron:router';
import { ReactiveVar }  from 'meteor/reactive-var';
import { Tracker }      from 'meteor/tracker';
import contracts        from '/imports/startup/contracts.js';
import db               from '/imports/api/db.js';
import _                from 'lodash';

Template['views_coop'].onCreated(function() {
  let template = this;

  template.coopVar = new ReactiveVar({});
  template.proposalVar = new ReactiveVar();

  template.address = Router.current().params.id;

  // Should rerun on new membership event
  Tracker.autorun(function() {  
    db.coops.get(template.address).then(function(coop) {
      return coop.fetchMembers();
    })
    .then(function(coop) {
      return coop.fetchProposals();
    })
    .then(function(coop) {
      coop.balance = web3.eth.getBalance(coop.address);
      console.log(coop);
      template.coopVar.set(coop);
    })
    .catch(function(err){
      console.log(err)
    });
  });
});

Template['views_coop'].helpers({

  'coopData' : function () {
    let template = Template.instance();
    return template.coopVar.get();
  },

  'toEther': function(wei) {
    return web3.fromWei(wei, "ether");
  },

  'notAMember': function() {
    let user = Session.get('user');
    let coop = Template.instance().coopVar.get();
    return _.every(coop.members, function(member) {
      return member.address != user.address;
    });
  },

  'selectedProposal': function() {
    let pId = Template.instance().proposalVar.get();
    let coop = Template.instance().coopVar.get();
    return coop.proposals ? coop.proposals[pId] : {};
  }
});

Template['views_coop'].events({

  'click .btn-join' : function(e, template) {

    let userAddr = Session.get('user').address;
    let coopAddr = template.address;

    // TODO don't want to set dependecy up for this get even if it is null? ?
    db.coops.get(coopAddr).then(function(coop){
      return coop.addMember(userAddr);
    }).then(function(data) {
      console.log(data);
    });

  },

  'submit .proposal-form' : function(e, template) {
    
    e.preventDefault();
    $('#newProposalModal').modal('hide');
    
    var proposalData = {
      'title': e.target.titleInput.value,
      'proposal': e.target.proposalInput.value
    }
  
    console.log(proposalData);
    let coopAddr = template.address;

    db.coops.get(coopAddr).then(function(coop) {
      return coop.submitProposal(proposalData);
    })
    .then(function(pId) {
      console.log(pId);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  'click .proposal-item': function(e, template) {
    template.proposalVar.set(e.currentTarget.id);
    $('#proposalVoteModal').modal('show');
    $("#against-btn").off('click').click(function () {
      console.log('against btn');
    });
  },

  'click .vote-for': function(e, template) {
    let pId = template.proposalVar.get();
    let coopAddr = template.address;
    voteOnProposal(coopAddr, pId, true);
  },

  'click .vote-against': function(e, template) {
    let pId = template.proposalVar.get();
    let coopAddr = template.address;
    voteOnProposal(coopAddr, pId, false);
  }

});

var voteOnProposal = function(coopAddr, pId, vote) {
  console.log(coopAddr);
  db.coops.get(coopAddr).then(function(coop) {
    return coop.voteOnProposal(pId, vote);
  })
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    console.log(err);
  });
  console.log("VOTED ");
}

