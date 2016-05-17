	/* INTERFACES & ABSTRACT CLASSES */

//Interface for getting contracts from CMC
contract ContractProvider {
    function contracts(bytes32 name) returns (address addr) {}
}

contract CMCEnabled {
  // Base class for all system contracts

  address public CMC;

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

contract UserRegistry {
  function setUserData(address user, bytes32 ipfsHash) returns(bool);
	function getUserData(address user) returns (bytes32);
}

/******************************************/

contract UserController is CMCEnabled {
	
	// Only contract with permission to write to UserRegistry

	// Should allow:
	// Operation			Permitted			
	// Add new User 		msg.sender			
	// Edit User 			msg sender
	// remove user 			msg sender


	function UserController() {

	}

	function getUser(address user) constant returns (bytes32) {
		
		address userRegAddr = ContractProvider(CMC).contracts("UserRegistry");

		// User registry may not exist if system deployed incorrectly.
		if (userRegAddr == 0x0) {
			return;
		}

    return UserRegistry(userRegAddr).getUserData(user);

	}

	function addUser(address user, bytes32 ipfsHash) returns (bool) {

		address userRegAddr = ContractProvider(CMC).contracts("UserRegistry");

		// User registry may not exist if system deployed incorrectly.
		if (userRegAddr == 0x0) {
			return false;
		}

		return UserRegistry(userRegAddr).setUserData(user, ipfsHash); 
	}

}