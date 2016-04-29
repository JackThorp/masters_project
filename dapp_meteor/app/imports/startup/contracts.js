import UserRegistry from '../contracts/UserRegistry.js';

let contract_locations = {
  //TestContract: "0xbe8a55f99e675fb3f42ff9d4071949fd5b076eef",
  UserRegistry: "0xbd6cff56ff7fe3bfed83030f8a2a711984cc39a3"
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
