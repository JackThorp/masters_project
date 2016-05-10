import { UserRegistry } from '../contracts/UserRegistry.js';
import { CoopRegistry } from '../contracts/CoopRegistry.js';
import { MembershipRegistry } from '../contracts/MembershipRegistry.js';

let contract_locations = {
  CoopRegistry:       "0x79c1576dbc0430457d8488ea0e8bb6a529cac323",
  UserRegistry:       "0xb3c19c0c1a88aefacc33bee267110e305b9dfa3c",
  MembershipRegistry: "0xdb5c943567da58a02cbeaa2023c04e254487e19e"
};


// Setup objects global for contract and helper connector objects
let contracts = {
		CoopRegistry: CoopRegistry.at(contract_locations.CoopRegistry),
		UserRegistry: UserRegistry.at(contract_locations.UserRegistry),
	  MembershipRegistry: MembershipRegistry.at(contract_locations.MembershipRegistry),
    helpers: {}
};

// TODO Add helpers for fetching user & coop information from IPFS. See WeiFund.

// objects.helpers.getCoopMembers
// objects.helpers.getUsersCoops

export default contracts;
