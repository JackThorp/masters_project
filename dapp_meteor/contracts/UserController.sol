contract UserController {
	
	// Only contract with permission to write to UserRegistry

	// Should allow:
	// Operation			Permitted			
	// Add new User 		msg.sender			
	// Edit User 			msg sender
	// remove user 			msg sender



	function getUser(address user) {
		
		if(msg.sender != user) {
		// Sender must have permission to view user data.
		// Sender must be a member of same cooperative.	
		}
		
	}

	function addUser() {

	}

	function updateUser() {

	}

	function removeUser() {

	}

}