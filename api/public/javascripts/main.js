var Ractive = require('ractive');
var Web3 = require('web3');

var web3
  , ractive
  , source
  , compiled
  , Contract
  , addr
  , coinbase;
  
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

ractive =  new Ractive({
  el: "#ractive-index",
  template: "#ractive-index-template",
  data: {
    blockNo: 'N/A',
    source: '',
    coinbase: 'N/A',
    transaction_hash: '<contract has not been deployed>',
    contract_address: '<contract transaction has not yet been processed>'
  }
});

window.setInterval(printBlockNumber, 1000);

function printBlockNumber() {
  web3.eth.getBlockNumber(function (err, res) {
    //console.log(res);
    ractive.set({ blockNo: res });
  });
};

function getCoinbase() {
  web3.eth.getCoinbase(function (err, res) {
    ractive.set('coinbase', res);
    ractive.set({
      coinBase: res
    });
    console.log('Coinbase: ' + res);
    deploy_contract();
  });
}

function deploy_contract() {

  var abiDefinition;

  console.log('Deploying Contract');

  // Compile contract
  compiled = web3.eth.compile.solidity(ractive.get('source'));
  
  console.log(compiled);

  contract = compiled[Object.keys(compiled)[0]];

  ractive.set('abiDefinition', contract.info.abiDefinition);
  
  // Create a contract class 'handle'
  Contract = web3.eth.contract(contract.info.abiDefinition)


  // Unlock account?
  // Currently running with coinbase unlocked on geth node

  // Deploy contract, get address
  Contract.new({
    data: contract.code, 
    from: ractive.get('coinBase'), 
    gas: 1000000
  }, function (err, myContract) {
    
    // Note, function will fire TWICE!
    // Once when transaction hash set, Once when it is deployed to an address.
    if(!err) {
      if(!myContract.address) {
        console.log('tx hash: ' + myContract.transactionHash) // The hash of the transaction, which deploys the contract
        ractive.set('transaction_hash', myContract.transactionHash);  
      } else { // check address on the second call (contract deployed)
        console.log('contract addr: ' + myContract.address) // the contract address
        addr = myContract.address;
        ractive.set('contract_address', myContract.address);
      }
    } else {
      console.log(err);
    }
  });
}

ractive.on('deploy', function(e) {
  getCoinbase();
});

ractive.on('callMethod', function(e, method, inputs) {
  console.log(method);
  console.log(inputs);

  if(addr) {
    contractInstance = Contract.at(addr);
    
    // Use underscore to extract 
    result = contractInstance[method]();
  }
});

