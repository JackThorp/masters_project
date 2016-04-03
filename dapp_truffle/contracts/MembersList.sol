contract MembersList {

  // Making  public automatically creates registry accessor function  
  mapping(address => bytes32) public members;

  // CANNOT RETURN MAP - keep track of size
  uint public size;

  function MembersList() {
    size = 0;
  }

  // Register a new coop to an address. A many to one mapping 
  function addMember(bytes32 name) {
    if(members[msg.sender] == "" && name != "") {
      members[msg.sender] = name;
      size++;
    }
  }

}
