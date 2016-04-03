contract Membership {

  // Making  public automatically creates registry accessor function  
  mapping(address => bytes32) public registry;

  // CANNOT RETURN MAP - keep track of size
  uint public registered;

  function CoopRegistry() {
    registered = 0;
  }

  // Register a new coop to an address. A many to one mapping 
  function register(bytes32 name) {
    if(registry[msg.sender] == "" && name != "") {
      registry[msg.sender] = name;
      registered++;
    }
  }

}
