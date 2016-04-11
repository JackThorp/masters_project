contract UserDB {

	struct User {
		bytes32 name;
	}

	event newUser(address _addr, bytes32 _name);

	// Adresses to member struct
	mapping (address => User) public users;

	// Keep array of keys for iterating map
	//address[] public memberKeys;
	//uint public numMembers = 0;

	function addUsers(address addr, bytes32 name) returns (bool result) {

		// permission checks on sender
		
		// Member cannot be added twice. 
		// Member name must be non-empty.
		// No zero value for struct - check null value for one of the fields.
		if (name == "" || users[addr].name != "") {
			return false;
		}

		users[addr] = User(name);
		newUser(addr, name);
		//memberKeys[numMembers] = addr;
		//numMembers++
		return true;
	}
}
