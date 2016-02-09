var blockapps = require("blockapps-js");
var Promise = require("bluebird");
var contract = blockapps.Solidity.attach({"code":"contract Payout {\n     address Victor;\n     address Jim;\n     address Kieren;\n\n     mapping (address => uint) ownershipDistribution; \n\n     function Setup() {\n       Victor = 0xaabb;\n       Jim    = 0xccdd;\n       Kieren = 0xeeff;\n\n       ownershipDistribution[Victor] = 35;\n       ownershipDistribution[Jim]  = 35;\n       ownershipDistribution[Kieren] = 30;\n     }\n\n     function Dividend() {\n       uint bal= this.balance;\n       Victor.send(bal * ownershipDistribution[Victor] / 100); \n       Jim.send(bal * ownershipDistribution[Jim] / 100);\n       Kieren.send(bal * ownershipDistribution[Kieren] / 100);\n     }\n}\n","name":"Payout","vmCode":"606060405261040e806100136000396000f30060606040526000357c01000000000000000000000000000000000000000000000000000000009004806358793050146100445780638df554b31461005157610042565b005b61004f60045061005e565b005b61005c6004506101ed565b005b61aabb600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555061ccdd600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555061eeff600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550602360036000506000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550602360036000506000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550601e60036000506000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055505b565b60003073ffffffffffffffffffffffffffffffffffffffff16319050600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166000606460036000506000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054840204604051809050600060405180830381858888f1935050505050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166000606460036000506000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054840204604051809050600060405180830381858888f1935050505050600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166000606460036000506000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054840204604051809050600060405180830381858888f19350505050505b5056","symTab":{"Setup":{"functionDomain":[],"functionArgs":[],"functionHash":"58793050","bytesUsed":"0","jsType":"Function","solidityType":"function() returns ()"},"Victor":{"atStorageKey":"0","bytesUsed":"14","jsType":"Address","solidityType":"address"},"Jim":{"atStorageKey":"1","bytesUsed":"14","jsType":"Address","solidityType":"address"},"Kieren":{"atStorageKey":"2","bytesUsed":"14","jsType":"Address","solidityType":"address"},"Dividend":{"functionDomain":[],"functionArgs":[],"functionHash":"8df554b3","bytesUsed":"0","jsType":"Function","solidityType":"function() returns ()"},"ownershipDistribution":{"atStorageKey":"3","mappingKey":{"bytesUsed":"14","jsType":"Address","solidityType":"address"},"bytesUsed":"20","jsType":"Mapping","mappingValue":{"bytesUsed":"20","jsType":"Int","solidityType":"uint256"},"solidityType":"mapping (address => uint256)"}},"address":"e76e9b309d3a0e6f72cadd8e0ac76c24edaac04a"});
blockapps.query.serverURI = 'http://strato-dev2.blockapps.net';

var Units = blockapps.ethbase.Units;
var globalKeystore;
var developerKeystore = '{"encSeed":{"encStr":"U2FsdGVkX19IpDR1zQPM8piXXKboyw2jt4ATY8YIkEF+UlltH6SUMw90DeIsYjPHdh+bgmcFdYGyT0/vhwg38vzN6aaTy5ICqCUX84URfKFaOWfS/9Ouk3oHZaG8pEfR","iv":"6e7e68e6fff591cce55ac1be68b70ab5","salt":"48a43475cd03ccf2"},"encHdRootPriv":{"encStr":"U2FsdGVkX1878ZZHu6IBB3Hmn48qd+5V+HaaW6AVGA9Ns83myOQ3rDpwyOcUga5RxE/ypni90TPeH88K58LsTOq4Knu32QkzRM/+bAYX7Vqf/i0diEOwa7Qb3H/iifizfh8BCjB7Xa4i/0T9PDFpv24S7uPxMEhkEA7dhcIp3cc=","iv":"74d8e45584369c26e55a6dbde0d42868","salt":"3bf19647bba20107"},"keyHash":"ab3a5a83dce11d4abd8a991e93d49f47dd48333776200b79425eb9755109a58e42668b47c9902dbbac602d26ec6e27fd3e2109dbdb7727fa227f29cbbeec0222","salt":{"words":[-1361699497,-1700956871,-1811656942,-1769434777],"sigBytes":16},"hdIndex":1,"encPrivKeys":{"2a7d8587dd873318c8a24488f8e1b0fda90c7abb":{"key":"U2FsdGVkX1+VcYvtT7UB93yB+f8AjSD3wk+JNv1ODBYVzUCevFWsAwbXdz2S2fmCWRC+SKk91QFxZWC6WnqBUA==","iv":"10faa6a2f9d52df87b0ac917c5c28912","salt":"95718bed4fb501f7"}},"addresses":["2a7d8587dd873318c8a24488f8e1b0fda90c7abb"]}';

function submit() {
    var userObj = {
        app: appCreateUser.value,
        email: emailCreateUser.value,
        loginpass: loginpassCreateUser.value,
        address: addressCreateUser.value,
        enckey: enckeyCreateUser.value
     };
    /*global function from registerUser.js */
    submitUser(userObj, function (res) {
        var data = JSON.parse(res);
        createUserDiv.style.display = "none";
        var para = document.createElement("P");
        para.setAttribute("id","walletCreateMessage");
        var t = document.createTextNode("Confirm in your email. This is your new wallet file: \n\n" + res);
        para.appendChild(t);
        document.body.appendChild(para);
        console.log("wallet: " + data.encryptedWallet);
        console.log("addresses: " + JSON.parse(data.encryptedWallet).addresses);
        
        var faucetAddr = JSON.parse(data.encryptedWallet).addresses[0];
        console.log("sending faucet request");
        blockapps.routes.faucet(faucetAddr).then(function() {
            console.log("faucet should have worked");
        });
    });
};

function showRegister() {
    keygenDiv.style.display = "table";
    loginDiv.style.display = "none";
    hideAuthButtons();
}

function showLogin() {
    createUserDiv.style.display = "none";
    if (typeof walletCreateMessage !== "undefined") walletCreateMessage.style.display = "none";
    keygenDiv.style.display = "none";
    loginDiv.style.display = "table";
    walletDiv.style.display="none";
    hideAuthButtons();
    hideFunctions();

};

function hideOnLoad() {
    createUserDiv.style.display = "none";
    walletDiv.style.display = "none";
    loginDiv.style.display = "none";
    functionsDiv.style.display = "none";
    keygenDiv.style.display = "none";
    walletPassword.style.display = "none";
}

function hideAuthButtons() {
    authButtonDiv.style.display = "none";
}

function hideFunctions() {
    functionsDiv.style.display = "none";
    walletPassword.style.display = "none";
}

function genKeyUser() {
    console.log("moving from keygen to create user");
    createUserDiv.style.display = "table";
    keygenDiv.style.display = "none";
    genKey(keypass.value, function (keystore) {
        addressCreateUser.value = keystore.addresses[0];
        enckeyCreateUser.value = keystore.serialize();
  
  });
};

function retrieve() {
    var userObj = {
        app : appLogin.value,
        email : emailLogin.value,
        loginpass : loginpassLogin.value,
        address : addressLogin.value
    };
    retrieveUser(userObj,function (keystore) {
        loginDiv.style.display = "none";
        walletaddress.value=keystore.addresses[0];
        walletDiv.style.display="block"
        loginDiv.style.display = "none";
        walletPassword.style.display = "block";
        globalKeystore = keystore;
        functionsDiv.style.display = "block";
        $('#passwordModal').modal('show');
        $('#passwordModal').on('shown.bs.modal', function () {
            $('#walletDecrypt').focus();
        });
    });
}

function developerRetrieve() {
    console.log("developer keystore: " + JSON.stringify(developerKeystore));
    loginDiv.style.display="none";
    walletaddress.value=JSON.parse(developerKeystore).addresses[0];
    walletDiv.style.display="block"
    loginDiv.style.display = "none";
    walletPassword.style.display = "block";
    globalKeystore = ethlightjs.keystore.deserialize(developerKeystore);
    functionsDiv.style.display = "block";
    hideAuthButtons();
    $('#passwordModal').modal('show')
    $('#passwordModal').on('shown.bs.modal', function () {
        $('#walletDecrypt').focus();
    });
}

function callFunc(funcName) {
    console.log("globalKeystore: " + JSON.stringify(globalKeystore));

    try {
        var privkey = globalKeystore.exportPrivateKey(
            walletaddress.value, document.getElementById("walletDecrypt").value);
        console.log("privkey: " + privkey);
    } catch (e) {
        $('#passwordModal').modal('show')
    }

    var args = [];
    var funcDivElts = document.getElementById(funcName + "Div").children;
    var len = funcDivElts.length;

    for (var i = 1; i < len-1; ++i) { // Skip the button and the value text input
        args.push(funcDivElts[i].value);
    }

    contract.state[funcName].apply(null,args).txParams({
        value : Units.ethValue(funcDivElts[len-1].value).in("ether")
    }).callFrom(privkey).then(afterTX);
}

function storageAfterTX(result) {
    var afterTXstring = "TX returned: " +
        ((result === undefined) ? "(nothing)":result);

    return Promise.props(contract.state).then(function(sVars) {
        afterTXstring += "\n\n Contract storage state:\n\n";
        for (name in sVars) {
            var svar = sVars[name]
            if (typeof svar === "function") {
                continue;
            }
            afterTXstring += "  " + name + " = " + svar + "\n";
        };
      return afterTXstring;  
    });
} 

function contractBalanceAfterTX(txString) {
    return contract.account.balance.then(function(bal) {
        return txString + "\n Contract balance =  " +
            Units.convertEth(bal).from("wei").to("ether") + " ether\n";
    });
}

function userBalanceAfterTX(txString) {
    return blockapps.ethbase.Account(globalKeystore.addresses[0]).balance.then(function(userBal) {
        return txString + "\n Your balance     =  " +
            Units.convertEth(userBal).from("wei").to("ether") + " ether\n";
    });
}

function resetTextArea(txString)  {
    document.getElementById("afterTXarea").textContent = txString;
}

function afterTX(result) {
    storageAfterTX(result)
      .then(function (txStr) { 
          return contractBalanceAfterTX(txStr);
        })
      .then(function (txStr) { 
          return userBalanceAfterTX(txStr);
        })
      .then(function (txStr) { 
          resetTextArea(txStr);
      });
} 
