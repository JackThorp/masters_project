import { UserRegistry } from '../contracts/UserRegistry.js';
import { CoopRegistry } from '../contracts/CoopRegistry.js';
import { MembershipRegistry } from '../contracts/MembershipRegistry.js';
import contractLocations from './contractLocations.js';

/*
let contract_locations = {
  CoopRegistry:       "0x360f3fd3dc1211b233389059f7f8f803c1eb3094",
  UserRegistry:       "0xcb3d817f28be3164acaa4e85c14952680bab673b",
  MembershipRegistry: "0x79c1576dbc0430457d8488ea0e8bb6a529cac323"
};
*/

// Setup objects global for contract and helper connector objects
let contracts = {
		CoopRegistry: CoopRegistry.at(contractLocations.CoopRegistry),
		UserRegistry: UserRegistry.at(contractLocations.UserRegistry),
	  MembershipRegistry: MembershipRegistry.at(contractLocations.MembershipRegistry),
    helpers: {}
};

// TODO Add helpers for fetching user & coop information from IPFS. See WeiFund.

// objects.helpers.getCoopMembers
// objects.helpers.getUsersCoops

export default contracts;
