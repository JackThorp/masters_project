var path = require('path');
var blocRootDir = path.normalize(path.join(__dirname, '..'));
var yamlConfig = require(path.join(blocRootDir, 'lib', 'yaml-config.js'));
var fs = require('fs');
var Mustache = require('mustache');
var lw = require('eth-lightwallet');

module.exports = { 
    writeHTML : writeHTML,
    writeJS : writeJS,
    writeCSS : writeCSS
};

// makes an HTML file with submit buttons for each function name,
// and text inputs labeled with the types of the arguments to the functions.
// It allows you to call functions and loads the result (return value) and change to storage in json
// also scaffolds a login demo and a register new user demo
// login or register!

// note: returns a string - we're doing code generation.
// wish I were using Haskell / Purescript - could be much more 'combinator focused', 'nested'
// composable widgets FTW!

function makeTemplateString(which) {
    return fs.readFileSync(path.join(
        blocRootDir, 'templates', which, 'contract.' + which + '.template'
    )).toString();
}

function writeHTML(appName, solObj) {
    var contractName = solObj.name;
    var symtab = solObj.symTab;
    var funcs = Object.keys(symtab).filter(function(name) {
        return symtab[name]["jsType"] === "Function";
    });

    var templateString = makeTemplateString("html");
    var inflatedHTML = Mustache.render(templateString, {
        appName: appName,
        contractName: contractName,
        serverURI: yamlConfig.readYaml('config.yaml').apiURL,
        funcs: funcs.map(function(funcName){
            //mustache style. (should replace with one the better template engines)
            return {
                name: funcName,
                args: symtab[funcName].functionArgs.map(function(arg){
                    return {argName: arg};
                })
            };
        }),
    });
    console.log('writing html/' + contractName + '.html');
    fs.writeFileSync('html/' + contractName + '.html', inflatedHTML);
};

function writeJS(contractName, solObjWAddr) {
    var symtab = solObjWAddr.symTab;
    var funcs = Object.keys(symtab).filter(function(name){
        return symtab[name]["jsType"] == "Function";
    });
    var templateString = makeTemplateString('js');

    var keystoreStr = fs.readFileSync('key.json').toString();
    var developerKeystore = lw.keystore.deserialize(keystoreStr);

    var inflatedJS = Mustache.render(templateString, {
        developerKeystore: JSON.stringify(developerKeystore),
        solObjWAddr: JSON.stringify(solObjWAddr),
        serverURI: yamlConfig.readYaml('config.yaml').apiURL,
     });
    console.log('writing js/' + contractName + '.js');
    fs.writeFileSync('js/' + contractName + '.js', inflatedJS);
};

function writeCSS(contractJSON)  {

};
