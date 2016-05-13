contract MembershipRegistry {


	event newMembership(address _member, address _coop);

	// List of members for each coop
	mapping(address => address[]) public coopToMembers;
	mapping(address => uint) public numMembers;

	// Makes inverse retrieval easier
	mapping(address => address[]) public memberToCoops;

	
	// Maintain memberIDs
	mapping(address => mapping(address => uint)) public toID;


	// Register a user as member of cooperative
	function register(address _user, address _coop) public returns (uint memberID){

		// check if member already registered?

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
}