/*************************************************************************/
/* INTERFACES & ABSTRACT CLASSES */

//Interface for getting contracts from CMC
contract ContractProvider {
  function contracts(bytes32 name) returns (address addr);
}

contract CoopContract {
	function membershipFee() returns (uint);
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

/************************************************************************/

contract MembershipRegistry is CMCEnabled {


	event newMembership(address _member, address _coop);

	// List of members for each coop
	mapping(address => address[]) public coopToMembers;
	mapping(address => uint) public numMembers;

	// Makes inverse retrieval easier
	mapping(address => address[]) public memberToCoops;

	
	// Maintain memberIDs
	mapping(address => mapping(address => uint)) public toID;


	// Register a user as member of cooperative
	function register(address _coop) public returns (uint memberID){

		// check if member already registered?
		// Sanity checks.
		// Sanitise input.
		// address user 	= msg.sender; TODO change so people can only register themselves.
		
		// Check valid user via User Controller or User Registry? (probably through controller)
		// Check valid coop by same token.
		
		address _user = msg.sender;
		uint payment 	= msg.value;
		uint fee = CoopContract(_coop).membershipFee();

		// Check sent amount is equal to fee. 
		if (payment != fee) {
			// Return Funds to Sender
			return;
		}

		// Don't register member twice. Is it bettern to return or throw?
		address[] joinedCoops = memberToCoops[_user];
		for (uint i = 0; i < joinedCoops.length; i++) {
			if(joinedCoops[i] == _coop) {
				return;
			}
		}

		// Return if payment of membership fee is unsuccessful
		if(!_coop.send(payment)) {
			return;
		}

		// Member is not registered yet
		memberID = coopToMembers[_coop].length;
		toID[_coop][_user] = memberID;
		
		coopToMembers[_coop].push(_user);
		memberToCoops[_user].push(_coop);
		numMembers[_coop] += 1;

		newMembership(_user, _coop);
	}
	


	// Remove user as member of cooperative
	function deregister(address _user, address _coop) public {
		
		var memberID = toID[_coop][_user];
		address addr = coopToMembers[_coop][memberID];
		
		// By setting to 0 don't have to worry about memberIDs??
		coopToMembers[_coop][memberID] = address(0);

		numMembers[_coop] -= 1;
		delete toID[_coop][_user];
	}

	function getMembers(address _coop) constant returns (address[]) {
		return coopToMembers[_coop];
	}

	function getCoops(address _member) constant returns (address[]) {
		return memberToCoops[_member];
	}
	
	function idOf(address _coop, address _member) public constant returns (uint) {
		return toID[_coop][_member];
	}
	
	function totalMembers(address _coop) public constant returns (uint){
		return numMembers[_coop];
	}

	function isMember(address _user, address _coop) public constant returns (bool) {
		address[] coops = memberToCoops[_user];
		for (uint i = 0; i < coops.length; i++) {
			if(coops[i] == _coop) {
				return true;
			}
		}
		return false;
	}
}