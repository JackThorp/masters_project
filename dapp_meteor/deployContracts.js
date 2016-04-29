var Web3  = require('web3');
var web3  = new Web3();
var fs    = require('fs');
var path  = require('path');

main();

function main() {
  
  var CONTRACTS_PATH = './contracts';
  var contracts = process.argv.slice(2).length > 0 ? args : getContractNames(CONTRACTS_PATH);
 
  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
  
  // Only function scope!!
  for(var i = 0; i < contracts.length; i++) {
    var name = contracts[i];
    var compiled = compileContract(name, CONTRACTS_PATH);
    var jsModule = writeJsModule(name, compiled);
    writeToFile(jsModule, path.join('app', 'imports', 'contracts', name + '.js'));
    deployContract(name, compiled);
  }
  
}

function getContractNames(contractsPath) {
  
  var fnames = fs.readdirSync(contractsPath);
  
  return fnames.filter(function(name) {
    return path.extname(name) == ".sol";
  }).map(function(name) {
    return path.basename(name, ".sol");
  });

}

function compileContract(name, contractsPath) {
  
  var contractPath = path.join(contractsPath, name + '.sol');
  var source = fs.readFileSync(contractPath).toString();
  return web3.eth.compile.solidity(source)[name];

}

function writeJsModule(name, contract) {
  
  var js = "";
  js += "import web3 from '../lib/thirdparty/web3.js' \n";
  js += "let " + name + " = web3.eth.contract(" + JSON.stringify(contract.info.abiDefinition).trim() + '); \n';
  js += "export default " + name + ";"; 
  return js;

}

function writeToFile(jsModule, path) {
  fs.writeFile(path, jsModule, function(err) {
    if (err) { throw err};
    console.log("Written to " + path);
  });
}
  
function deployContract(name, contract) { 
 
  var toDeploy = [
    'UserRegistry',
    'CoopRegistry'
  ];

  // Don't deploy all contracts
  if (toDeploy.indexOf(name) < 0) {
    return;
  }

  var txObj = {
    gasPrice: web3.eth.gasPrice,
    gas: 5000000,
    from: web3.eth.coinbase,
    data: contract.code
  }
  
  var Contract = web3.eth.contract(contract.info.abiDefinition); 

  Contract.new(txObj, function(err, deployedContract){
    
    if(err) {
      console.error(err);
    }
             
    if(deployedContract.address) {
      console.log(name + ": " + deployedContract.address);
      // TODO write addresses into contracts module...
    }
  });
}
