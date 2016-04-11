if(!LocalStore.get('contracts')) {
  LocalStore.set('contracts', {
      UserDB: "0x125a07a93300874035c7bf3f5de2f752e34b5c8f",
      CoopDB: "0x7f924236c00c8124b4877f2d5ddda1ec5e763ce8"
  });
}


var contracts = LocalStore.get('contracts');

// Setup objects global for contract and helper connector objects
objects = {
	contracts: {
		UserDB: UserDB.at(contracts.UserDB),
		CoopDB: CoopDB.at(contracts.CoopDB),
	},
	helpers: {}
};

// TODO Add helpers for fetching user & coop information from IPFS. See WeiFund.

// objects.helpers.getCoopMembers
// objects.helpers.getUsersCoops
