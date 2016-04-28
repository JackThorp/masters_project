var Web3  = require('web3');
var web3  = new Web3();
var fs    = require('fs');
var path  = require('path');

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

var defaultContracts = [
  'UserDB',
  'CoopDB'
];

var args = process.argv.slice(2) 
var contracts = args.length > 0 ? args : defaultContracts;

var contractsPath = './app/client/lib/contracts';
var transactionObj = {
  gasPrice: web3.eth.gasPrice,
  gas: 5000000,
  from: web3.eth.coinbase,
  value: 400000
}

// Only function scope!!
for(var i = 0; i < contracts.length; i++) {
  deployContract(contracts[i]);
}

function deployContract(name) {
  
  var contractPath = path.join(contractsPath, name + '.sol');
  var source = fs.readFileSync(contractPath).toString();
  var contract = web3.eth.compile.solidity(source)[name];
  var Contract = web3.eth.contract(contract.info.abiDefinition);
    
  transactionObj.data = contract.code;

  Contract.new(transactionObj, function(err, deployedContract){
    
    if(err) {
      console.error(err);
      console.log("ARR!");
    }
             
    if(deployedContract.address) {
      console.log(name + ": " + deployedContract.address);
      JSON.stringify(deployedContract, null, '\t');
      //writeToFile(name, deployedContract);  
    }
  });
  

};

function writeToFile(contract, info) {
  fs.writeFile(contract + '.json', JSON.stringify(info, null, '\t'), function(err) {
    if (err) { throw err};
    console.log(contract + '.json saved!');
  });
}
