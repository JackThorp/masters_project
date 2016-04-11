// test timeout
var timeout = 20000;

MochaWeb.testOnly(function(){    
    describe("web3 connectivity", function(){
        it("should connect to web3", function(done){
            web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
            done();
        });

        it("should provide valid gas price", function(done){
            web3.eth.getGasPrice(function(err, result){
                chai.assert.isNull(err, null);
                chai.assert.property(result, 'toNumber');
                chai.assert.isNumber(result.toNumber(10));
                done();
            });
        });
    });


    // Mock address for use in tests. 
    var testAddr = "0x" + web3.sha3("ABC").substring(0,40);

    describe("UserDB unit tests", function(){
      
        // Construct Multiply Contract Object and contract instance
        var contractInstance, transactionObject = {
            data: UserDB.bytecode, 
            gasPrice: web3.eth.gasPrice,
            gas: 500000,
            from: web3.eth.accounts[0]
        };

        it("should deploy a new UserDB Contract", function(done){
            this.timeout(timeout);
            
            UserDB.new(transactionObject, function(err, contract){
              
                chai.assert.isNull(err);
               
                // Callback fires twice, second time when deployed.
                if(contract.address) {
                    contractInstance = contract;
                    done();
                }
            });
        });
        
        it("should be able to add member", function(done){
            this.timeout(timeout);
       
            // Listen for member being added
            contractInstance.newUser().watch(function(err, res) {
              chai.assert.isNull(err);
              var user = UserDB.at(contractInstance.address).users(testAddr);
              chai.assert.equal(web3.toAscii(user).replace(/\u0000/g, ''), "Jack");
              done(); 
            });

            // Calling methods that are not static requires from else throws invalid address
            // Result here is the transaction hash
            contractInstance.addUser(testAddr, "Jack", {from: web3.eth.accounts[0]}, function(err, result){
                chai.assert.isNull(err);
            });
        });
       
        it("should not add member twice", function(done) {
          done();
        });
         
    });
    
    describe("CoopDB unit tests", function(){
      
        // Construct Multiply Contract Object and contract instance
        var contractInstance, transactionObject = {
            data: CoopDB.bytecode, 
            gasPrice: web3.eth.gasPrice,
            gas: 500000,
            from: web3.eth.accounts[0]
        };

        it("should deploy a new CoopDB Contract", function(done){
            this.timeout(timeout);
            
            CoopDB.new(transactionObject, function(err, contract){
              
                chai.assert.isNull(err);
               
                // Callback fires twice, second time when deployed.
                if(contract.address) {
                    contractInstance = contract;
                    done();
                }
            });
        });
        /*
        it("should be able to add member", function(done){
            this.timeout(timeout);
       
            // Listen for member being added
            contractInstance.newMember().watch(function(err, res) {
              chai.assert.isNull(err);
              var member = MemberDB.at(contractInstance.address).members(testAddr);
              chai.assert.equal(web3.toAscii(member).replace(/\u0000/g, ''), "Jack");
              done(); 
            });

            // Calling methods that are not static requires from else throws invalid address
            // Result here is the transaction hash
            contractInstance.addMember(testAddr, "Jack", {from: web3.eth.accounts[0]}, function(err, result){
                chai.assert.isNull(err);
            });
        });
       */        
    });

});
