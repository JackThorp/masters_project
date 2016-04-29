contract MembershipController {
	
	// This contract is the only contract that can CRUD the Membership registry
	event Registered(address _coop, address _member, uint _memberID);
	event Unregistered(address _coop, address _member, uint _memberID);

	function joinCoop(address _coop) {
		
		// Sanitise input.

		var user = msg.sender;

		// Check valid user. 


	}


	function leaveCoop(address _coop) {

		// sanitise
		// check permissions
		// check coop.

	}


	function getMembersOf(address _coop) {

	}

	function getCoopsOf(address _member) {

	}
}