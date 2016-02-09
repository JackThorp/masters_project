// Voting with delegation
contract TestBallot {

	// blocapps won't compile throw for some reason?
	bytes32 error;


	struct Proposal {
		bytes32 name;	// Short name of proposal
		uint voteCount;	// Number of votes
	}

	Proposal[] proposals;

	address public chairperson;

	// Create a new ballot to choose one of proposalName
	function TestBallot() {

		chairperson = msg.sender;
		proposals[0] = Proposal({
			name: "Hillary Sanders",
			voteCount: 0
		});


	}

	function getName() constant returns (bytes32 name) {
		name = proposals[0].name;
	}

	// Gives a voter the right to vote. Voters may only be added by the chair.
	function giveRightToVote(address voter) {

	}

	// Delegate vote to somebody else.
	function delegate(address to) {

		
	}

	function vote(uint proposal) {

	
	}

	function winningProposal() constant returns (uint winningProposal) {

	}

}


