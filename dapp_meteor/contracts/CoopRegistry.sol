/*************************************************************************/
/* INTERFACES & ABSTRACT CLASSES */

//Interface for getting contracts from CMC
contract ContractProvider {
  function contracts(bytes32 name) returns (address addr) {}
}

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

/************************************************************************/

contract CoopContract is CMCEnabled {

	// Contract for a cooperative
	// Potentially not necessary to have own contract but is good for extensibility
	// e.g coop can collect funds/ether etc.
	event newMotionCreated(uint _mId);
	event motionPassed(uint _mId);
	event motionDefeated(uint _mId);
	event motionVote(uint _mId);

  struct ProposalVotes {
    bool passed;
    bool defeated;
    uint vAgainst;
    uint vFor;
    mapping(address => bool) voted;
  }

  // Ordinary Motion
  struct Motion {
    uint id;
    bytes32 ipfsHash;
    ProposalVotes pVotes;
  }

  uint public motionCounter;
  mapping(uint => Motion) proposedMotions;

	bytes ipfsDataHash;
	uint	public membershipFee;	
	uint 	public quorum;
	uint 	public normalRes;
	//uint 	public extraordinaryRes;

	function CoopContract(bytes _ipfsDataHash, uint _membershipFee, uint _quorum, uint _nRes) {
		ipfsDataHash 	= _ipfsDataHash;
		membershipFee = _membershipFee;
		quorum 				= _quorum;
		normalRes			= _nRes;
    motionCounter = 0;
	}

	function setCoopData(bytes ipfsHash) returns (bool) {
		ipfsDataHash = ipfsHash;
	}

	function getCoopData() constant returns (bytes) {
		return ipfsDataHash;
	}

  function getMotionData(uint mId) constant returns (bytes32) {
  	return proposedMotions[mId].ipfsHash;
  }

  function getVotesFor(uint mId) constant returns (uint) {
  	return proposedMotions[mId].pVotes.vFor;
  }

  function getVotesAgainst(uint mId) constant returns (uint) {
		return proposedMotions[mId].pVotes.vAgainst;
  }
	
	function hasPassed(uint mId) constant returns (bool) {
		return proposedMotions[mId].pVotes.passed;
  }

  function hasFailed(uint mId) constant returns (bool) {
		return proposedMotions[mId].pVotes.defeated;
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

  function proposeMotion (bytes32 _ipfsHash) returns (uint _mId) {

    if(!isAMember(msg.sender)) {
      return;
    }

    uint mId                = motionCounter++;
    proposedMotions[mId]    = Motion({
      id: mId, 
      ipfsHash: _ipfsHash, 
      pVotes: ProposalVotes({passed: false, defeated: false, vAgainst: 0, vFor: 0})
    });

    newMotionCreated(mId);
    return mId;
  }

  function supportMotion (uint mId, bool _vFor) returns (bool success) {

    if (!isAMember(msg.sender)) {
      return;
    }
    
    Motion motion = proposedMotions[mId];
    
    // Need different check here? ? 
    //if (motion.id == 0) {
    //  return;
    //}

    // Check if they have already voted for motion.
    if (motion.pVotes.voted[msg.sender]) {
      return;
    }

    // Register the vote TODO (extract into shared function byref / byVal)
    if (_vFor) {
      motion.pVotes.vFor++;
    } else {
      motion.pVotes.vAgainst++;
    }
    motionVote(mId);


    motion.pVotes.voted[msg.sender] = true;

    uint numMembers = getNumMembers(); 
    uint totalVotes = motion.pVotes.vFor + motion.pVotes.vAgainst;

    var turnout = totalVotes / numMembers;
    if (turnout < (quorum / 100)) {
      return;
    }

    var result = motion.pVotes.vFor / totalVotes;
    if (result >= (normalRes / 100)) {
      motion.pVotes.passed = true;
      motionPassed(mId);
    } else {
    	motion.pVotes.defeated = true;
    	motionDefeated(mId);
    } 
    return;
  }

}
/******************************************************************************/
contract CoopRegistry is CMCEnabled {
	
	// This contract acts as a registry DB for all the coops in the app. 
	
	event newRegistration(address _coop);

	// Mapping from coop ID to address
	address[] public coops;
	uint public numCoops;

	// Map allows efficient delete operation.
	mapping(address => uint) coopIndex;


	function addCoop(address _coop) returns (bool result) {

		var length = coops.push(_coop);
		coopIndex[_coop] = length - 1;
		numCoops += 1;
		newRegistration(_coop);
		return true;
	}

	function newCoop(bytes _ipfsDataHash, uint _membershipFee, uint _quorum, uint _nRes) returns (bool result) {

		address _coop = new CoopContract(_ipfsDataHash, _membershipFee, _quorum, _nRes);
		CoopContract(_coop).setCMCAddress(CMC);

		var length = coops.push(_coop);
		coopIndex[_coop] = length - 1;
		numCoops += 1;
		newRegistration(_coop);
		return true;
	}
	
	function removeCoop(address _coop) returns (bool result) {

		// Delete sets entry to zero. It does not remove element.
		uint index = coopIndex[_coop];
		delete coops[index];
		numCoops -= 1;
		return true;
	}

	// Was not compiling as constant by default. . .
	function getCoops() constant returns (address[] _coops) {
		return coops;
	}

	function isRegistered(address _coop) returns (bool ) {
		//TODO test this.
		return coopIndex[_coop] != 0;
	}

}