import { UserRegistry } from '../contracts/UserRegistry.js';
import { CoopRegistry } from '../contracts/CoopRegistry.js';

let contract_locations = {
  CoopRegistry: "0xb2f918f587a46369c0e40680d31db05a576e1e49",
  UserRegistry: "0xbd6cff56ff7fe3bfed83030f8a2a711984cc39a3"
};


// Setup objects global for contract and helper connector objects
let contracts = {
		CoopRegistry: CoopRegistry.at(contract_locations.CoopRegistry),
		UserRegistry: UserRegistry.at(contract_locations.UserRegistry),
	  helpers: {}
};

// TODO Add helpers for fetching user & coop information from IPFS. See WeiFund.

// objects.helpers.getCoopMembers
// objects.helpers.getUsersCoops

export default contracts;
