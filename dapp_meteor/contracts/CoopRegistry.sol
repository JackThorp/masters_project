contract CoopRegistry {
	
	// This contract acts as a registry DB for all the coops in the app. 
	
	event newCoop(address _coop);

	// Mapping from coop ID to address
	address[] public coops;
	uint public numCoops;

	// Map allows efficient delete operation.
	mapping(address => uint) coopIndex;


	function addCoop(address _coop) returns (bool result) {

		var length = coops.push(_coop);
		coopIndex[_coop] = length - 1;
		numCoops += 1;
		newCoop(_coop);
		return true;
	}

	
	function removeCoop(address _coop) returns (bool result) {

		// Delete sets entry to zero. It does not remove element.
		uint index = coopIndex[_coop];
		delete coops[index];
		numCoops -= 1;
		return true;
	}

	// Was not compiling as constant by default. . .
	function getCoops() constant returns (address[] _coops) {
		return coops;
	}

}