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


contract CoopRegistry_full is CMCEnabled {
	
	// This contract acts as a registry DB for all the coops in the app. 
	
	event newCoop(address _coop);

	// Mapping from coop ID to address
	address[] public coops;
	uint public numCoops;

	// Map allows efficient delete operation.
	mapping(address => uint) coopIndex;


	function addCoop(address _coop) returns (bool result) {

		if(!checkSender(msg.sender, "coopController")) {
			return false;
		}
		// Sanitise input.

		var length = coops.push(_coop);
		coopIndex[_coop] = length - 1;
		numCoops += 1;

		return true;
	}

	
	function removeCoop(address _coop) returns (bool result) {

		if(!checkSender(msg.sender, "coopController")) {
			return false;
		}

		// sanitise inputs 

		// Delete sets entry to zero. It does not remove element.
		uint index = coopIndex[_coop];
		delete coops[index];
		numCoops -= 1;
		return true;
	}

}