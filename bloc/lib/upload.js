var fs = require('fs');
var Solidity = require('blockapps-js').Solidity;
var codegen = require('./codegen.js');

// IIFE unnecessary here; no identifiers
module.exports = upload;
function upload(contractName, privkey) { 
    var abiFile = "meta/" + contractName + ".json";
    var solObj0 = JSON.parse(fs.readFileSync(abiFile, {encoding:"utf8"}));
    if ("address" in solObj0) {
        delete solObj0.address;
    }
    var solObj = Solidity.attach(solObj0);

    return solObj.newContract(privkey).get("account").get("address").
        then(function(addr){
            solObj.address = addr.toString();
            fs.writeFileSync(abiFile, JSON.stringify(solObj));
            return solObj;
        });
}

/*
module.exports.writeContractJSON = function (jsonPayload) {
    if (jsonPayload.error !== undefined) { console.log("upload unsuccessful, not writing"); }
    else {
      var contractName = jsonPayload.abis[0].name;
      console.log('compile successful, writing contractmeta/'+contractName+'.json');
      fs.writeFileSync('contractmeta/'+contractName+'.json', JSON.stringify(jsonPayload));
    }
}
*/
