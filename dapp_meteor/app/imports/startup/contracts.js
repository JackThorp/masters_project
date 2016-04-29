import UserRegistry from '../contracts/UserRegistry.js';

let contract_locations = {
  //TestContract: "0xbe8a55f99e675fb3f42ff9d4071949fd5b076eef",
  UserRegistry: "0x3a02e860f1c57849c33a6eb3fd724d1740d44b62"
};


// Setup objects global for contract and helper connector objects
let contracts = {
		//TestContract: TestContract.at(contract_locations.TestContract),
		UserRegistry: UserRegistry.at(contract_locations.UserRegistry),
	  helpers: {}
};

// TODO Add helpers for fetching user & coop information from IPFS. See WeiFund.

// objects.helpers.getCoopMembers
// objects.helpers.getUsersCoops

export default contracts;
