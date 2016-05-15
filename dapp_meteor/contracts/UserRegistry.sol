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

/******************************************/
contract UserRegistry is CMCEnabled {
	
	// Holds mapping of user addresses to their data (stored in IPFS)

	// Only the UserController is allowed to CRUD on the registry.
	  
	event newUser(address indexed _addr);

  mapping(address => bytes) ipfsDataHash;


  function setUserData(address user, bytes ipfsHash) {
  		
  		//if(!checkSender(msg.sender, "userController")){
  		//	return;
  		//}

    ipfsDataHash[user] = ipfsHash;
		newUser(user);
  }


  function getUserData(address addr) constant returns(bytes) {

  		//if(!checkSender(msg.sender, "userController")) {
  		//	return;
  		//}

    return ipfsDataHash[addr];
  }
}