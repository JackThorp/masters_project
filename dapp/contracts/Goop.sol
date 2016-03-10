contract Goop {
    
  struct Member {
    address addr;
    bytes32 name;
  }
  
  struct Organisation {
    bytes32 name;
    uint numMembers;
    mapping (uint => Member) members;
  }
  
  uint numOrganisations;
  mapping (uint => Organisation) public organisations;
  
  function newOrganisation(bytes32 name) returns (uint orgID) {
    orgID = numOrganisations++; 
    Organisation org = organisations[orgID]; 
  }
  
  function join(uint orgID, bytes32 name) {
    Organisation o = organisations[orgID];
    Member m = o.members[o.numMembers++];
    m.addr = msg.sender;
    m.name = name;
  }

  function getFive() returns (uint num) {
    num = 5;
  }

}
