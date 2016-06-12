import './coop.html';
import { Router }       from 'meteor/iron:router';
import { ReactiveVar }  from 'meteor/reactive-var';
import { Tracker }      from 'meteor/tracker';
import contracts        from '/imports/startup/contracts.js';
import db               from '/imports/api/db.js';
import _                from 'lodash';
import { Chartist }     from 'meteor/mfpierre:chartist-js';

Template['views_coop'].onCreated(function() {
  let template = this;

  template.coopVar = new ReactiveVar({});
  template.proposalVar = new ReactiveVar();
  template.charts = {};

  template.address = Router.current().params.id;

  // Should rerun on new membership event
  Tracker.autorun(function() {  
    db.coops.get(template.address).then(function(coop) {
      return coop.fetchMembers();
    })
    .then(function(coop) {
      console.log("fetchint proposals");
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
    return Template.instance().proposalVar.get();
    //let coop = Template.instance().coopVar.get();
    //return coop.proposals ? coop.proposals[pId] : {};
  },

  'totalVotes': function(proposal) {
    return parseInt(proposal.votesFor) + parseInt(proposal.votesAgainst);
  },

  'toReachQuorum': function(proposal) {
    let coop  = Template.instance().coopVar.get();
    let q     = parseInt(coop.quorum.toString(10)) /100;
    let tVotes  = parseInt(proposal.votesFor.toString(10)) + parseInt(proposal.votesAgainst.toString(10));
    let qVotes  =  Math.ceil(coop.members.length * q);
    return Math.max(0, qVotes - tVotes);  
  },

  'isClosed': function(proposal) {
    return proposal.passed || proposal.defeated;
  },

  'isOpen': function(proposal) {
    return !(proposal.passed || proposal.defeated);
  },

  "blockNumber": function() {
    return web3.eth.blockNumber;
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
    
    var endBlock = e.target.endBlockInput.value;
    
    let coopAddr = template.address;
    
    db.coops.get(coopAddr).then(function(coop) {
      return coop.submitProposal(proposalData, endBlock);
    })
    .then(function(pId) {
      console.log(pId);
    })
    .catch(function(err) {
      console.log(err);
    });
    
  },

  'click .proposal-item': function(e, template) {

    let coop = Template.instance().coopVar.get();
    let charts = Template.instance().charts;
    let proposal = coop.proposals[e.currentTarget.id];
    Template.instance().proposalVar.set(proposal);


    $('#proposalVoteModal').modal('show');
    $('#proposalVoteModal').on('shown.bs.modal', function() {
      updateChart(charts, coop, proposal);
    });
  },

  'click .vote-for': function(e, template) {
    let proposal = template.proposalVar.get();
    let coopAddr = template.address;
    voteOnProposal(coopAddr, proposal, true);
  },

  'click .vote-against': function(e, template) {
    let proposal = template.proposalVar.get();
    let coopAddr = template.address;
    voteOnProposal(coopAddr, proposal, false);
  }

});

var voteOnProposal = function(coopAddr, proposal, vote) {
  db.coops.get(coopAddr).then(function(coop) {
    return coop.voteOnProposal(proposal.id, vote);
  })
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    console.log(err);
  });
  console.log("VOTED ");
}

var updateChart = function(charts, coop, proposal) {
  
  // Working with big numbers;
  let vf  = parseInt(proposal.votesFor.toString(10));
  let va  = parseInt(proposal.votesAgainst.toString(10));
  let tv  = vf + va;
  
  tv = Math.max(1, tv);
  vf = (vf/tv) * 100;
  va = (va/tv) * 100;

  if(!(proposal.passed || proposal.defeated)) {
    let q   = parseInt(coop.quorum.toString(10)) / 100;
    let m   = coop.members.length;
    let to  = tv / m; //turnout
    if (to < q) {
      vf = vf * (to/q);
      va = va * (to/q);
    }
  }
  
  let data = {
    labels: ['for', 'against'],
    series: [va, vf]
  }

  let options = {
    donut: true,
    donutWidth: 40,
    startAngle: 0,
    total: 100,
    showLabel: false
  };
  
  if (charts[proposal.id]) {
    charts[proposal.id].update(data);
  } else {
    charts[proposal.id] = new Chartist.Pie('#chart-'+proposal.id, data, options); 
  }
}

