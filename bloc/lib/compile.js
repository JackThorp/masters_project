var fs = require('fs');
var codegen = require('./codegen.js');
var Solidity = require('blockapps-js').Solidity;

module.exports = compileSol;
function compileSol(soliditySrcArray,appName) {
   // add regex ignore

    return soliditySrcArray.map(function (src) {
        return Solidity(src).tap(function(solObj) {
            var abiFile = "meta/" + solObj.name + ".json";
            console.log('compile successful, writing ' + abiFile);

            // Only the prototype needs to be attached to reconstruct
            fs.writeFileSync(abiFile, JSON.stringify(solObj,null,2));
        }).catch(function(e) {
            console.log("compile failed with error message: " + e);
        });
    });
}
