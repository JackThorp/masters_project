/* INTERFACES & ABSTRACT CLASSES */

//Interface for getting contracts from CMC
contract ContractProvider {
  function contracts(bytes32 name) returns (address addr);
}

contract MembershipRegistry {
	function register(address _user, address _coop) returns (uint id);
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

contract CoopContract is CMCEnabled {

	// Contract for a cooperative
	// Potentially not necessary to have own contract but is good for extensibility
	// e.g coop can collect funds/ether etc.

	bytes ipfsDataHash;
	uint	public membershipFee;	
	uint 	public quorum;
	uint 	public normalRes;
	uint 	public extraordinaryRes;

	// Can only be set by coops UK contract.
	bool certified;

	function CoopContract(bytes _ipfsDataHash, uint _membershipFee) {
		ipfsDataHash 	= _ipfsDataHash;
		membershipFee = _membershipFee;
	}

	function setCoopData(bytes ipfsHash) returns (bool) {
		ipfsDataHash = ipfsHash;
	}

	function getCoopData() constant returns (bytes) {
		return ipfsDataHash;
	}

}