var Web3    = require('web3');
var web3    = new Web3();
var fs      = require('fs');
var path    = require('path');
var Promise = require('bluebird');
var _       = require('lodash');
var solc    = require('solc');

main();

/* Call with 'node deployContracts.js ?compile contractNames  
 * - add compile to stop deploying
 */

function main() {
  
  var CONTRACTS_PATH  = './contracts';
  var compileOnly     = process.argv[2] == "compile";
  var namePos         = compileOnly ? 3 : 2;
  var names           = process.argv.slice(namePos);
  var contractNames   = names.length > 0 ? names : getContractNames(CONTRACTS_PATH);
 
  // CMC (Contract Management Contract) is required for deploymet
  if (!compileOnly) {
    contractNames.push("CMC");
  }

  var toDeploy = [
    'UserRegistry',
    'UserController',
    'CoopRegistry',
    'MembershipRegistry',
    'MembershipController'
  ];

  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
 
  console.log("Account 1 balance: " + web3.eth.getBalance(web3.eth.accounts[0]).toString(10));
 
  var compiledContracts = {};
  
  // Only function scope!!
  for(var i = 0; i < contractNames.length; i++) {
    var name = contractNames[i];
    var compiled = compileContract(name, CONTRACTS_PATH);
    console.log("Compiled " + name);
    var jsModule = writeJsModule(name, compiled);
    writeToFile(jsModule, path.join('app', 'imports', 'contracts', name + '.js'));
    compiledContracts[name] = compiled;
  }

  if (compileOnly) {
    return
  }

  var deployedContracts = [];
  var CMCContract = {};
  var txObj = {
    gasPrice: web3.eth.gasPrice,
    gas: 1000000,
    from: web3.eth.accounts[0],
  }

  // Deploy contract manager contract first in order to register each contract
  // in the system.
  deployContract("CMC", compiledContracts["CMC"], txObj).then(function(cmc) {
    
    CMCContract = Promise.promisifyAll(cmc);

    _.forEach(compiledContracts, function(contract, name) {
      if (_.indexOf(toDeploy, name) >= 0) {
        deployedContracts.push(deployContract(name, contract, txObj));
      }
    });

    return Promise.all(deployedContracts);
    
  })
  .map(function(dc) {
    // Register with the CMC
    // CHECK REGISTRATION IS SUCCESSFUL?
    CMCContract.addContractAsync(dc.name, dc.address, txObj).catch(function(err) {
      console.log(err)
    });  
    return dc;
  })
  .then(function(dcs) {
    var file  = "var contractLocations = { \n";
    dcs.push(CMCContract);
    dcs.forEach(function(contract){
      file += "\t" + contract.name + ":\t'" + contract.address + "',\n";
    });
    file += "};\n"
    file += "export default contractLocations"
    writeToFile(file, path.join('app', 'imports', 'startup', 'contractLocations.js'));
  })
  .catch(function(err) {
    console.log(err);
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
  var compiled = solc.compile(source, 1).contracts[name];
  compiled.jsonInterface = JSON.parse(compiled.interface);
  return compiled;
}

function writeJsModule(name, contract) {
  var codeName = name + "Code";   
  var js = "";
  js += "import web3 from '../lib/thirdparty/web3.js' \n";
  js += "let " + name + " = web3.eth.contract(" + contract.interface + '); \n';
  js += "let " + codeName + "  = " + JSON.stringify(contract.bytecode).trim() + ";\n";
  js += "export {" + name + ", " + codeName + " }"; 
  return js;
}

function writeToFile(jsModule, path) {
  fs.writeFile(path, jsModule, function(err) {
    if (err) { throw err};
    console.log("Written to " + path);
  });
}
  
function deployContract(name, contract, txObj) { 
  
  txObj.data = contract.bytecode;
  
  var Contract = web3.eth.contract(contract.jsonInterface); 

  return new Promise(function(resolve, reject) {
    Contract.new(txObj, function(err, deployedContract){
     
      if(err) return reject(err);
      
      if(deployedContract && deployedContract.address) {
        console.log("Deployed " + name + " at: " + deployedContract.address);   
        deployedContract.name = name;
        return resolve(deployedContract);
      }
    });
    
  });
}
