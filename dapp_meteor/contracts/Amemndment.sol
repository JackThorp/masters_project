contract CoopRules {
  
  enum {quorum, fee, normalRes, extraRes}

  // Address of coop this contract belongs to
  address coop;

  struct ammendment {
    uint id;
    uint rule;
    uint value;
    uint votes;
    mapping(address => bool) votes;
  }

  mapping(uint => ammendment) public proposedAmmendments;


  function proposeAmmendment(uint rule, uint newValue) {

    // Check sender is member of coop

    // Add proposal
  }

  function supportAmmendment(uint id) {

    // Check sender is coop member.

    // Check if they have already voted for ammendment.

    // Check if vote reaches level of extraordinary resolution
    // If so, change the rules.
    // Fire event
    
    // Remove ammendment proposal.
  }
}