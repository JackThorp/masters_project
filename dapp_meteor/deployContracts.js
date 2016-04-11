var Web3  = require('web3');
var web3  = new Web3();
var fs    = require('fs');
var path  = require('path');

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

deployContracts();


function deployContracts() {
 
  var contracts = [
    'UserDB',
    'CoopDB'
  ];

  var contractsPath = './app/client/lib/contracts';
  var transactionObj = {
    gasPrice: web3.eth.gasPrice,
    gas: 500000,
    from: web3.eth.coinbase
  }

  for(var i = 0; i < contracts.length; i++) {

    var name = contracts[i];
    var contractPath = path.join(contractsPath, name + '.sol');
    var source = fs.readFileSync(contractPath).toString();
    var contract = web3.eth.compile.solidity(source)[name];
    var Contract = web3.eth.contract(contract.info.abiDefinition);
    
    transactionObj.data = contract.code;

    Contract.new(transactionObj, function(err, deployedContract){
    
      if(err) {
        console.error(err);
      }
             
      if(deployedContract.address) {
        console.log(name + ": " + deployedContract.address);
      }
    });

  };
}
