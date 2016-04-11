contract CoopDB {

	// This contract acts as a registry DB for all the coops in the app. 
	
	struct Coop {
		address addr;
		bytes32 name;
	}

	// For quick access
	mapping (address => Coop) public coops;

	// For search
	//bytes32[] public names;
	//uint public size;

	// Constructor
	//function CoopDB() {
	//	size = 0;
	//}

	// Add a coop to the database
	function addCoop(bytes32 name, address addr) returns (bool result) {

		// Sanitise input.
		if(name == "" || addr == 0x0) {
			return false;
		}

		// Cannot add new coop with taken name.
		// TODO what about different names to same address? ?
		if(coops[addr].name != "") {
			return false;
		}

		coops[addr] = Coop(addr, name);
		return true;
	}
}