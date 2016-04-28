contract UserRegistry {
	
	// Holds mapping of user addresses to their data (stored in IPFS)

	// Only the UserController is allowed to CRUD on the registry.
	  
	event UserAdded(address indexed _addr);

  	mapping(address => bytes) ipfsDataHash;


  	function setUserData(address user, bytes ipfsHash) {
  		
  		//if(!checkSender(msg.sender, "userController")){
  		//	return;
  		//}

    	ipfsDataHash[user] = ipfsHash;
		UserAdded(user);
  	}


  	function getUserData(address addr) constant returns(bytes) {

  		//if(!checkSender(msg.sender, "userController")) {
  		//	return;
  		//}

    	return ipfsDataHash[addr];
  	}
}