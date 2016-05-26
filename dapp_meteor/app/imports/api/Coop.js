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
      gas: 400000,
      gasPrice: web3.eth.gasPrice,
      value: this.fee
    }

    let coopAddr = this.address;
    var registeredPromise = membershipRegistry.newMembershipAsync({
      _member: userAddr,
      _coop: coopAddr
    });

    // Capture the TX hash for looking up in BC explorers
    membershipRegistry.registerAsync(coopAddr, txObj).catch(function(err) {
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
    let motionPromises = []

    return coopInstance.motionCounterAsync().then((numMotions) => {
    
      for(var i = 0; i < numMotions; i++) {
        motionPromises.push(coopInstance.getMotionDataAsync(i));
      }
      return Promise.all(motionPromises);
    })
    .map((motionHash) => {
      console.log(motionHash);
      let ipfsHash = db.ethToIpfs(motionHash);
      return this.ipfs.catJsonAsync(ipfsHash);
    })
    .map((motionData, mId) => {
      proposals[mId] = motionData;
      proposals[mId].id = mId;
      return coopInstance.getVotesForAsync(mId);
    })
    .map((votesFor, mId) => {
      proposals[mId].votesFor = votesFor;
      return coopInstance.getVotesAgainstAsync(mId);
    })
    .map((votesAgainst, mId) => {
      proposals[mId].votesAgainst = votesAgainst;
      return coopInstance.hasPassed(mId);
    })
    .map((passed, mId) => {
      proposals[mId].passed = passed;
      return coopInstance.hasFailed(mId);
    })
    .map((failed, mId) => {
      proposals[mId].failed = failed;
      return proposals[mId];
    })
    .then((proposals) => {
      console.log(proposals)
      coop.proposals = proposals;
      return coop;
     // _.forEach(motionData, function(data, mId) {
     //   motionPromises.push(coopInstance.getVotesForAsync(mId));
     //   proposals[mId] = data;
     //   proposals[mId].id = mId;
     // })
     // return Promise.all(motionPromises); 
    })
    /*
    .map((vFor, mId) => {
      console.log(vFor);
      proposals[mId].vFor = vFor;
      return coopInstance.getVotesAgainstAsync(mId);
    })
    .each((vAgainst, mId) => {
      proposals[mId].vAgainst = vAgainst;
      return proposals;
    })
    .then((proposals) => {
      coop.proposals = proposals;
      return coop;
    })
    */
    .catch(function(err) {
      console.log(err);
    });
  }

  // submit a new motion
  submitProposal(proposalData) {
     
    var txObj = {
      from: Session.get('user').address,
      gas: 400000,
      gasPrice: web3.eth.gasPrice
    }

    let coopInstance = this.coopInstance;
    return this.ipfs.addJsonAsync(proposalData).then((hash) => {
      var ethHash = db.ipfsToEth(hash);
      return coopInstance.proposeMotionAsync(ethHash, txObj)
    })
    .catch(function(err) {
      console.log(err);
    });

  }

  voteOnProposal(pId, vote) {
    var txObj = {
      from: Session.get('user').address,
      gas: 400000,
      gasPrice: web3.eth.gasPrice
    }

    let coopInstance = this.coopInstance;
    return coopInstance.supportMotionAsync(pId, vote, txObj);
  }
}

export default Coop;
