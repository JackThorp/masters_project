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
		if(CMC != 0x0){
            if (sender == ContractProvider(CMC).contracts(name)){
                return true;
            }
            return false;
        } else {
            return false;
        }
  	}

    // Makes it so that CMC is the only contract that may kill it.
    function remove(){
        if(msg.sender == CMC){
            suicide(CMC);
        }
    }
}

/************************************************************************/

contract MembershipRegistry is CMCEnabled{

	// Registry to track the membership of users in coops
	// Only membership controller has permissions to CRUD this registry.
	

	// List of members for each coop
	mapping(address => address[]) public coopToMembers;
	mapping(address => uint) public numMembers;

	// Makes inverse retrieval easier
	mapping(address => address[]) public memberToCoops;
	
	// Maintain memberIDs
	mapping(address => mapping(address => uint)) public toID;


	// Register a user as member of cooperative
	function register(address _user, address _coop) public returns (uint memberID){

		// sanity checks.

		if(!checkSender(msg.sender, "membershipController")) {
			return;
		}
		
		memberID = coopToMembers[_coop].length++;
		coopToMembers[_coop].push(_user);
		memberToCoops[_user].push(_coop);
		toID[_coop][_user] = memberID;
		numMembers[_coop] += 1;

		//Registered(_coop, _user, memberID);
	}
	


	// Remove user as member of cooperative
	function deregister(address _user, address _coop) public {
		
		// Sanity checks.
		if(!checkSender(msg.sender, "membershipController")) {
			return;
		}

		var memberID = toID[_coop][_user];
		address addr = coopToMembers[_coop][memberID];
		
		//if(addr == 0x) {
		//	return;
		//}
		// By setting to 0 don't have to worry about memberIDs??
		coopToMembers[_coop][memberID] = address(0);

		numMembers[_coop] -= 1;
		delete toID[_coop][_user];
		//Unregistered(_coop, _user, memberID);
	}

	function getMembers(address _coop) constant returns (address[]) {
		// Sanity checks.
		
		if(!checkSender(msg.sender, "membershipController")) {
			return;
		}
		
		return coopToMembers[_coop];
	}

	function getCoops(address _member) constant returns (address[]) {
		// Sanity checks.
		
		if(!checkSender(msg.sender, "membershipController")) {
			return;
		}

		return memberToCoops[_member];
	}
	
	function idOf(address _coop, address _member) public constant returns (uint) {
		// Sanity checks.
		
		if(!checkSender(msg.sender, "membershipController")) {
			return;
		}

		return toID[_coop][_member];
	}
	
	function totalMembers(address _coop) public constant returns (uint){
		// Sanity checks.
		
		if(!checkSender(msg.sender, "membershipController")) {
			return;
		}

		return numMembers[_coop];
	}
}