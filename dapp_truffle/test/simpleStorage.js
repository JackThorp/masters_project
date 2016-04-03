contract('SimpleStorage', function(accounts) {

	it('Should set a new value', function(done) {

		var account = accounts[0];

		var contract = SimpleStorage.at(SimpleStorage.deployed_address);
		
		contract.set(5, {from: account})
		.then(function(tx_id) {
			return contract.storedData.call();
		})
		.then(function(val){
			assert.equal(val, 5);
			done();
		})
		.catch(function(e){
			console.log(e);
			done();
		});
		
	})
})