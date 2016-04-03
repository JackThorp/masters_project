contract SimpleStorage {
  
  function SimpleStorage() {
  }
  
  uint public storedData; 
  address setter;

  function set(uint x) {
      storedData = x;
      setter = msg.sender;
  }

  function get() constant returns (uint retVal) {
      return storedData;
  }

  function getSetter() constant returns (address retVal) {
      return setter;
  }
}
