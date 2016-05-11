contract CoopContract {

	// Contract for a cooperative
	// Potentially not necessary to have own contract but is good for extensibility
	// e.g coop can collect funds/ether etc.

	bytes ipfsDataHash;	

	// Can only be set by coops UK contract.
	bool certified;

	function CoopContract(bytes ipfsHash) {
		ipfsDataHash = ipfsHash;
	}

	function setCoopData(bytes ipfsHash) returns (bool) {
		ipfsDataHash = ipfsHash;
	}

	function getCoopData() constant returns (bytes) {
		return ipfsDataHash;
	}
}