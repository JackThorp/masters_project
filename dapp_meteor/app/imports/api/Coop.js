class Coop {
  
  constructor() {

  }

  // Fetches the coops members
  fetchMembers() {

  }

  // Validates coop (only works for Coops UK account)
  authorise() {

  }
}

/*
    .then(function(data) {
      console.log(data);
      // create coop object with fill member method.
      
      // Augment Coop Data with IPFS hash and contract address
      /*
      data.ipfsHash = ipfsHash.substring(2);
      data.address = coopAddr;

      contracts.MembershipRegistry.getMembers(coopAddr, function(err, _members) {
        
        if(err) {
          console.log(err);
          return;
        }
        
        data.members = _members;
        
        //3.  
        Coops.insert(data, function(err, res) {
          if(err) {
            console.log(err);
          }
        });

      });
      
    })
    .catch(function(err) {
      console.log(err);
    });
  fillMembers(cb) {
    var thisCoop = this
    var fullMembers = [];
    var memberCounter = 0;
    var memberSize = thisCoop.members.length
    for(var i = 0; i < memberSize; i++) {
      
      contracts.UserRegistry.getUserData(thisCoop.members[i], function(err, ipfsHex) {
      
        // Check for error.
        if(err) {
          console.log(err);
          return;
        }

        // 'Current user' is not yet registered in userdb.
        if(ipfsHex == "0x") {
          console.log("member not registered as user?");
          return;
        }

        Helpers.fromIPFS(ipfsHex, function(err, memberData) {
         
          fullMembers.push(memberData);
          memberCounter++;
          if(memberCounter == memberSize) {
            cb(fullMembers);
          }
          //thisCoop.members[i] = memberData; // Set member data
          
        });
      });
    }
 
*/ 

