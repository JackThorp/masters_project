contract MembershipDB {
	
	// Map from member address to list of coops.
	mapping (address => address[]) public memberToCoops;

	// Map from coop address to list of members.
	mapping (address => address[]) public coopToMembers;


	// Member / Coop joins another coop.
	function joinCoop(address user, address coop) returns (bool result) {

		// Permissions. Only specific controller allowed to call this function.
		// The controller makes sure that the joining party is a member of the application.

		// OR should this contract act as the controller? Perhaps for now.

		// Could result be null array?
		memberToCoops[user].push(coop);
		coopToMembers[coop].push(user);
		return true;
	}
}