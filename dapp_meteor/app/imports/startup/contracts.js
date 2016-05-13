import { UserRegistry } from '../contracts/UserRegistry.js';
import { CoopRegistry } from '../contracts/CoopRegistry.js';
import { MembershipRegistry } from '../contracts/MembershipRegistry.js';
import contractLocations from './contractLocations.js';

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
