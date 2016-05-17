/***********************************************************************/
/* INTERFACES & ABSTRACT CLASSES */

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

    // Makes it so that CMC is the only contract that may kill it.
    function remove(){
        if(msg.sender == CMC){
            suicide(CMC);
        }
    }
}

/***********************************************************************/

contract CMC {
	
	// Contract Management Controller
	// Manages names and addresses of contracts in our system. 
	// This is the authority reference for other contracts checking permissions etc.

	address owner;

    // This is where we keep all the contracts.
    mapping (bytes32 => address) public contracts;

    function CMC() {
        owner = msg.sender;
    }


    function addContract(bytes32 name, address addr) {
        if(msg.sender != owner){
            return;
        }

        // Set the contract manager of new contract to this CMC
    	if(!CMCEnabled(addr).setCMCAddress(address(this))){
        	return;
    	}

        contracts[name] = addr;
    }


    function removeContract(bytes32 name) returns (bool result) {
        
        if (contracts[name] == 0x0){
            return false;
        }

        if(msg.sender != owner){
            return;
        }

        contracts[name] = 0x0;
        
        return true;
    }


    function getContract(bytes32 name) constant returns (address addr) {
        return contracts[name];
    }


    function remove() {
        if (msg.sender == owner){
 			
 			address userReg 				= contracts["userRegistry"];
            address userController 			= contracts["userController"];
            address coopReg 				= contracts["coopRegistry"];
            address coopController			= contracts["coopController"];
            address membershipReg 			= contracts["membershipRegistry"];
            address membershipController	= contracts["membershipController"];
            address coopsUK					= contracts["coopsUK"];

            // Remove everything.
            if(userReg != 0x0){ CMCEnabled(userReg).remove(); }
            if(userController != 0x0){ CMCEnabled(userController).remove(); }
            if(coopReg != 0x0){ CMCEnabled(coopReg).remove(); }
            if(coopController != 0x0){ CMCEnabled(coopController).remove(); }
            if(membershipReg != 0x0){ CMCEnabled(membershipReg).remove(); }
            if(membershipController != 0x0){ CMCEnabled(membershipController).remove(); }
            if(coopsUK != 0x0){ CMCEnabled(coopsUK).remove(); }

            // Finally, remove the CMC. CMC will now have all the funds of the other contracts,
            // and when suiciding it will all go to the owner.
            suicide(owner);
        }
    }
	
}