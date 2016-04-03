// Truffle's custom 'describe' function 'contract' redeploys contract before each test for clean slate.

// 'contract' creates ref to deployed contract as JS object
// Handle this way if no static address (not in config)		
// var CR = CoopRegistry.at(CoopRegistry.deployed_address);

// Handle this way if static address (defined in config)
// console.log(CoopRegistry.deployed());

contract('CoopRegistry', function(accounts) {
	it('Should be initialised with an empty registry', function(done) {
		
		var contract = CoopRegistry.deployed();
		
		contract.registered.call()
		.then(function(size) {
			assert.equal(size, 0);
			done();
		})
		.catch(function(err){
			console.log(err);
			done();
		})
	})

	it('Should add a new name to the register', function(done) {

		var account = accounts[0];

		var contract = CoopRegistry.deployed();
		
		contract.register("big coop", {from: account})
		.then(function(tx_id) {
			return contract.registered.call();
		})
		.then(function(size){
			assert.equal(size, 1);
			done();
		})
		.catch(function(e){
			console.log(e);
			done();
		});
		
	})

})