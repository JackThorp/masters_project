// Voting with delegation
contract Ballot {

	// blocapps won't compile throw for some reason?
	bytes32 error;

	struct Voter {

		uint weight;		// weight is accumulated by delegation
		bool voted;			// True if person has already voted
		address delegate;	// person delegated to
		uint vote;			// index of vote
	}

	// Type for a single proposal
	struct Proposal {
		bytes32 name;	// Short name of proposal
		uint voteCount;	// Number of votes
	}

	address public chairperson;

	// Create a public map of all the voters
	mapping(address => Voter) public voters;

	// Dynamic array of proposals
	Proposal[] public proposals;
	uint numProposals;

	// Create a new ballot to choose one of proposalName
	function SetUp() {


		chairperson = msg.sender;
		voters[chairperson].weight = 1;

		bytes32[] proposalNames;
		proposalNames[0] = "Bernie Sanders";
		proposalNames[1] = "Donald Trump";
		proposalNames[2] = "Hilary Clinton";
		proposalNames[3] = "Kanye West";

		// TODO create contract with argument? Not currently supported in blockapps??
		// Add each proposal to the proposals array
		for (uint i = 0; i < proposalNames.length; i++) {

			proposals[numProposals] = Proposal({
				name: proposalNames[i],
				voteCount: 0
			});
			numProposals++;
		}
	}

	// Gives a voter the right to vote. Voters may only be added by the chair.
	function giveRightToVote(address voter) {

		if (msg.sender != chairperson || voters[voter].voted){
		
			// terminte and revert all changes to ether balance. Also
			// consumes all gas provided.
			error = "Only chair can add voters";
			return;
		} 

		voters[voter].weight = 1;
	}

	// Delegate vote to somebody else.
	function delegate(address to) {

		Voter sender = voters[msg.sender];

		if (sender.voted) {
			error = "Already voted";
			return;
		} 
		
		// Find the end of the delegation chain.
		// Stops when delegate field is uninitialised or cycle detected.
		while (voters[to].delegate != address(0) && voters[to].delegate != msg.sender) {
			to = voters[to].delegate;
		}

		// Do not allow self delegation or loops.
		if (to == msg.sender) {	
			error = "Self delegation or cycle found.";
			return;
		}

		// Since `sender` is a reference, this
        // modifies `voters[msg.sender].voted`
        sender.voted = true;
        sender.delegate = to;
        Voter delegate = voters[to];
        
        if (delegate.voted) {
        	// If delegate voted then add sender weight to chosen proposal.
        	proposals[delegate.vote].voteCount += sender.weight; 
        } else {
        	// If delegate not yet voted then add weight to delegate.
        	delegate.weight += sender.weight;
        }	
	}

	function vote(uint proposal) {

		Voter sender = voters[msg.sender];

		if (sender.voted) { 
			
			error = "Attempt to vote more than once."; 
			return;
		}

		sender.voted = true;
		sender.vote = proposal;

		// If `proposal` is out of the range of the array, this will throw automatically and revert all changes.
        proposals[proposal].voteCount += sender.weight;
	}

	function winningProposal() constant returns (uint winningProposal) {

		uint winningVoteCount = 0;

		for (uint p = 0; p < proposals.length; p++) {

			if (proposals[p].voteCount > winningVoteCount) {
				winningVoteCount = proposals[p].voteCount;
				winningProposal = p;
			}
		}
	}

}

