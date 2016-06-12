/********************************************************/
/********************************************************/

contract ContractProvider {
  function contracts(bytes32 name) returns (address addr) {}
}

/********************************************************/
/********************************************************/

contract CMCEnabled {
  // Base class for all system contracts

  address CMC;

  function setCMCAddress(address CMCAddr) returns (bool result){
    // Once the cmc address is set, don't allow it to be set again, except by the
    // doug contract itself.
    if(CMC != 0x0 && msg.sender != CMC){
      return false;
    }
    CMC = CMCAddr;
      return true;
  }

  function checkSender(address sender, bytes32 name) returns(bool) {
    return (CMC != 0x0 && sender == ContractProvider(CMC).contracts(name));
  }

  // Makes it so that CMC is the only contract that may kill it.
  function remove(){
    if(msg.sender == CMC){
      suicide(CMC);
    }
  }
}

/********************************************************/
/********************************************************/

contract MembershipRegistry {
  function isMember(address _user, address _coop) returns (bool);
  function totalMembers(address _coop) returns (uint);
}

/********************************************************/
/********************************************************/

contract CoopContract is CMCEnabled {

	// Contract for a cooperative
	// Potentially not necessary to have own contract but is good for extensibility
	// e.g coop can collect funds/ether etc.
	event newProposalCreated(uint _pId);
	event proposalPassed(uint _pId);
	event proposalDefeated(uint _pId);
	event proposalVote(uint _pId);

  struct ProposalVotes {
    bool passed;
    bool defeated;
    uint vAgainst;
    uint vFor;
    mapping(address => bool) voted;
  }

  struct Proposal {
    uint id;
    bytes32 ipfsHash;
    ProposalVotes pVotes;
  }

  uint public proposalsCounter;
  mapping(uint => Proposal) proposals;

	bytes ipfsDataHash;
	uint	public membershipFee;	
	uint 	public quorum;
	uint 	public normalRes;

  address scheduler;

	function CoopContract(bytes _ipfsDataHash, uint _membershipFee, uint _quorum, uint _nRes) {
		ipfsDataHash 	= _ipfsDataHash;
		membershipFee = _membershipFee;
		quorum 				= _quorum;
		normalRes			= _nRes;
    proposalsCounter = 0;
    scheduler     = 0xb8da699d7fb01289d4ef718a55c3174971092bef;
	}

	function setCoopData(bytes ipfsHash) returns (bool) {
		ipfsDataHash = ipfsHash;
	}

	function getCoopData() constant returns (bytes) {
		return ipfsDataHash;
	}

  function getProposalData(uint pId) constant returns (bytes32) {
  	return proposals[pId].ipfsHash;
  }

  function getVotesFor(uint pId) constant returns (uint) {
  	return proposals[pId].pVotes.vFor;
  }

  function getVotesAgainst(uint pId) constant returns (uint) {
		return proposals[pId].pVotes.vAgainst;
  }
	
	function hasPassed(uint pId) constant returns (bool) {
		return proposals[pId].pVotes.passed;
  }

  function hasFailed(uint pId) constant returns (bool) {
		return proposals[pId].pVotes.defeated;
  }
	// TODO mark privte . . .
  function isAMember(address sender) returns (bool) {
    address memRegAddr = ContractProvider(CMC).contracts("MembershipRegistry");
    return MembershipRegistry(memRegAddr).isMember(msg.sender, this);
  }

  function getNumMembers() returns (uint) {
    address memRegAddr = ContractProvider(CMC).contracts("MembershipRegistry");
    return MembershipRegistry(memRegAddr).totalMembers(this);
  }

  function newProposal (bytes32 _ipfsHash, uint _endBlock) returns (uint _pId) {

    newProposalCreated(98);

    if(!isAMember(msg.sender)) {
      return;
    }

    // check block number is greater than current block by X (see alarm clock service)? 

    uint pId        = proposalsCounter++;
    proposals[pId]  = Proposal({
      id: pId, 
      ipfsHash: _ipfsHash, 
      pVotes: ProposalVotes({
      	passed: false, 
      	defeated: false, 
      	vAgainst: 0, 
      	vFor: 0
      })
    });

    // Signature of proposal evaluation function
    bytes4 sig = bytes4(sha3("closeProposal(uint)"));
    
    // Signature of alarm service scheduleCall function
    bytes4 scheduleCallSig = bytes4(sha3("scheduleCall(bytes4,uint256)"));

    // Schedule closing of this proposal
    scheduler.call(scheduleCallSig, sig, _endBlock);

    newProposalCreated(pId);
    return pId;
  }

  function supportProposal (uint pId, bool _vFor) returns (bool success) {

    if (!isAMember(msg.sender)) {
      return;
    }
    
    Proposal proposal = proposals[pId];
    
    // Need different check here? ? 
    //if (motion.id == 0) {
    //  return;
    //}
    
    // Return if motion has ended
    bool passed     = proposal.pVotes.passed;
    bool defeated   = proposal.pVotes.defeated;
    if(passed || defeated) {
    	return;
    }

    // Check if they have already voted for motion.
    if (proposal.pVotes.voted[msg.sender]) {
      return;
    }

    // Register the vote TODO (extract into shared function byref / byVal)
    if (_vFor) {
      proposal.pVotes.vFor++;
    } else {
      proposal.pVotes.vAgainst++;
    }
    proposalVote(pId);
    proposal.pVotes.voted[msg.sender] = true;
  }

  function closeProposal(uint pId) returns (bool) {

    //TODO restrict close proposal to alarm service!!

    Proposal proposal = proposals[pId];
  	uint numMembers = getNumMembers(); 
    uint totalVotes = proposal.pVotes.vFor + proposal.pVotes.vAgainst;

    // Vote defeated if quorum not reached
    var turnout = totalVotes / numMembers;
    if (turnout < (quorum / 100)) {
    	proposal.pVotes.defeated = true;
    	proposalDefeated(pId);
      return true;
    }

  	// Calculate resolution level
  	var result = proposal.pVotes.vFor / totalVotes;
  	if (result >= (normalRes / 100)) {
    	proposal.pVotes.passed = true;
    	proposalPassed(pId);
  	} else {
  		proposal.pVotes.defeated = true;
  		proposalDefeated(pId);
  	} 
  	return true;
	}
}