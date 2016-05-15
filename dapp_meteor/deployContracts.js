var Web3    = require('web3');
var web3    = new Web3();
var fs      = require('fs');
var path    = require('path');
var Promise = require('bluebird');

main();

/* Call with 'node deployContracts.js ?compile contractNames  
 * - add compile to stop deploying
 */

function main() {
  
  var CONTRACTS_PATH  = './contracts';
  var compileOnly     = process.argv[2] == "compile";
  var namePos         = compileOnly ? 3 : 2;
  var names           = process.argv.slice(namePos);
  var contracts       = names.length > 0 ? names : getContractNames(CONTRACTS_PATH);
  
  var toDeploy = [
    'UserRegistry',
    'CoopRegistry',
    'MembershipRegistry'
  ];

  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
 
  console.log("Account 1 balance: " + web3.eth.getBalance(web3.eth.accounts[0]).toString(10));
 
  var deployedContracts = [];
  // Only function scope!!
  for(var i = 0; i < contracts.length; i++) {
    var name = contracts[i];
    var compiled = compileContract(name, CONTRACTS_PATH);
    var jsModule = writeJsModule(name, compiled);
    
    writeToFile(jsModule, path.join('app', 'imports', 'contracts', name + '.js'));
  
    if(!compileOnly && toDeploy.indexOf(name) >= 0){
      deployedContracts.push(deployContract(name, compiled));
    }
  }

  //TODO write to file properly using a buffer? ?
  Promise.all(deployedContracts).then(function(dc) {
    var file;
    file  = "var contractLocations = { \n";
    dc.forEach(function(contract){
      file += "\t" + contract.name + ":\t'" + contract.address + "',\n";
    });
    file += "};\n"
    file += "export default contractLocations"
    writeToFile(file, path.join('app', 'imports', 'startup', 'contractLocations.js'));
  });
  
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
  
  var codeName = name + "Code";   
  var js = "";
  js += "import web3 from '../lib/thirdparty/web3.js' \n";
  js += "let " + name + " = web3.eth.contract(" + JSON.stringify(contract.info.abiDefinition).trim() + '); \n';
  js += "let " + codeName + "  = " + JSON.stringify(contract.code).trim() + ";\n";
  js += "export {" + name + ", " + codeName + " }"; 
  return js;

}

function writeToFile(jsModule, path) {
  fs.writeFile(path, jsModule, function(err) {
    if (err) { throw err};
    console.log("Written to " + path);
  });
}
  
function deployContract(name, contract) { 
 
  
  var txObj = {
    gasPrice: web3.eth.gasPrice,
    gas: 1000000,
    from: web3.eth.accounts[0],
    data: contract.code
  }
  
  var Contract = web3.eth.contract(contract.info.abiDefinition); 
 
  return new Promise(function(resolve, reject) {
    Contract.new(txObj, function(err, deployedContract){
      
      if(err) return reject(err);
               
      if(deployedContract && deployedContract.address) {
        return resolve({
          name: name,
          address: deployedContract.address
        });
      }
    });
  });
}
