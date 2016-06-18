import _                  from 'lodash';
import Promise            from 'bluebird'
import contracts          from '/imports/startup/contracts.js';
import db                 from '/imports/api/db.js';
import CoopReactor        from './CoopReactor.js';
import { CoopContract, CoopContractCode }     from '/imports/contracts/CoopContract.js';

var membershipRegistry = Promise.promisifyAll(contracts.MembershipRegistry);

class Coop {

  constructor(addr, data, fee, quorum, normalRes, ipfs, dep) {
    this.data     = data;
    this.address  = addr;
    this.fee      = fee;
    this.quorum   = quorum;
    this.normalRes = normalRes;
    this.ipfs     = ipfs;
    this.dep      = dep;
    this.coopInstance = Promise.promisifyAll(CoopContract.at(addr));
    this.reactor  = new CoopReactor(addr); 
    this.reactor.setUpListener();
  }
  
  // Add member when user joins the cooperative
  addMember(userAddr) {

    var txObj = {
      from: userAddr,
      gas: 2000000,
      gasPrice: web3.eth.gasPrice,
      value: this.fee
    }

    let coopAddr = this.address;
    var registeredPromise = membershipRegistry.newMembershipAsync({
      _member: userAddr,
      _coop: coopAddr
    });

    // Capture the TX hash for looking up in BC explorers
    membershipRegistry.registerAsync(coopAddr, txObj).then(function(tx) {
      console.log(tx);
    })
    .catch(function(err) {
      console.log(err);
    });
    
    return registeredPromise;
  }

  // Fetches the coops members
  fetchMembers() {

    let coop = this;

    return membershipRegistry.getMembersAsync(coop.address).then(function(memberAddresses) {
      
      var memberPromises = [];
      //console.log(memberAddresses);
      for(var i = 0; i < memberAddresses.length; i++) {

        // Use reflect to implement settle all 
        memberPromises.push(db.users.get(memberAddresses[i]).reflect());
      }
      return Promise.all(memberPromises);
    })
    .filter(function(memberPromise) {
      return memberPromise.isFulfilled();
    })
    .map(function(memberPromise){
      return memberPromise.value();
    })
    .then(function(members) {
      coop.members = members;
      return coop;
    });
  }
  
  fetchProposals() {

    // ADD DEPENDECY TO COOP REACTOR HERE
    this.reactor.register(this.dep);
    
    let coop = this;
    let proposals = [];
    let coopInstance = this.coopInstance;
    let proposalPromises = [];

    console.log(coopInstance);
    return coopInstance.proposalsCounterAsync().then((numProposals) => {
    
      console.log("proposals counter: " + numProposals);
      for(var i = 0; i < numProposals; i++) {
        proposalPromises.push(coopInstance.getProposalDataAsync(i));
      }
      return Promise.all(proposalPromises);
    })
    .map((proposalHash) => {
      console.log(proposalHash);
      let ipfsHash = db.ethToIpfs(proposalHash);
      return this.ipfs.catJsonAsync(ipfsHash);
    })
    .map((proposalData, pId) => {
      proposals[pId] = proposalData;
      proposals[pId].id = pId;
      return coopInstance.getVotesForAsync(pId);
    })
    .map((votesFor, pId) => {
      proposals[pId].votesFor = votesFor;
      return coopInstance.getVotesAgainstAsync(pId);
    })
    .map((votesAgainst, pId) => {
      proposals[pId].votesAgainst = votesAgainst;
      return coopInstance.hasPassedAsync(pId);
    })
    .map((passed, pId) => {
      proposals[pId].passed = passed;
      return coopInstance.hasFailedAsync(pId);
    })
    .map((failed, pId) => {
      proposals[pId].failed = failed;
      return coopInstance.endBlockAsync(pId);
    })
    .map((endBlock, pId) => {
      proposals[pId].endBlock = endBlock;
      return proposals[pId];
    })
    .then((proposals) => {
      console.log(proposals)
      coop.proposals = proposals;
      return coop;
    })
    .catch(function(err) {
      console.log(err);
    });
  }

  // submit a new proposal
  submitProposal(proposalData, endBlock) {
     
    var txObj = {
      from: Session.get('user').address,
      gas: 400000,
      gasPrice: web3.eth.gasPrice
    }
    
    let submittedPromise = {};
    let thisCoop = this;
    let coopInstance = this.coopInstance;

    return this.ipfs.addJsonAsync(proposalData).then((hash) => {
      var ethHash = db.ipfsToEth(hash);
      
      submittedPromise = coopInstance.newProposalCreatedAsync({
        _ipfsHash: ethHash
      });

      return coopInstance.newProposalAsync(ethHash, endBlock, txObj);
    })
    .then(function() {
      return submittedPromise;
    })
    .then(function() {
      return thisCoop;
    })
    .catch(function(err) {
      console.log(err);
    });

  }

  voteOnProposal(pId, vote) {
    let user = Session.get('user').address;

    var txObj = {
      from: user,
      gas: 400000,
      gasPrice: web3.eth.gasPrice
    }

    let coopInstance = this.coopInstance;
    let votePromise = coopInstance.proposalVoteAsync({
      _member: user
    });
    
    coopInstance.supportProposalAsync(pId, vote, txObj).catch(function(err) {
      console.log(err);
    });

    return votePromise;
  }

  hasVoted(user, pId) {
    return this.coopInstance.hasVotedAsync(user, pId);
  }
}

export default Coop;
