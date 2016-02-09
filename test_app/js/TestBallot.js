var blockapps = require("blockapps-js");
var Promise = require("bluebird");
var contract = blockapps.Solidity.attach({"code":"// Voting with delegation\ncontract TestBallot {\n\n\t// blocapps won't compile throw for some reason?\n\tbytes32 error;\n\n\n\tstruct Proposal {\n\t\tbytes32 name;\t// Short name of proposal\n\t\tuint voteCount;\t// Number of votes\n\t}\n\n\tProposal[] proposals;\n\n\taddress public chairperson;\n\n\t// Create a new ballot to choose one of proposalName\n\tfunction TestBallot() {\n\n\t\tchairperson = msg.sender;\n\t\tproposals[0] = Proposal({\n\t\t\tname: \"Hillary Sanders\",\n\t\t\tvoteCount: 0\n\t\t});\n\n\n\t}\n\n\tfunction getName() constant returns (bytes32 name) {\n\t\tname = proposals[0].name;\n\t}\n\n\t// Gives a voter the right to vote. Voters may only be added by the chair.\n\tfunction giveRightToVote(address voter) {\n\n\t}\n\n\t// Delegate vote to somebody else.\n\tfunction delegate(address to) {\n\n\t\t\n\t}\n\n\tfunction vote(uint proposal) {\n\n\t\n\t}\n\n\tfunction winningProposal() constant returns (uint winningProposal) {\n\n\t}\n\n}\n\n\n","name":"TestBallot","vmCode":"60606040525b33600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506040604051908101604052807f48696c6c6172792053616e64657273000000000000000000000000000000000081526020016000815260200150600160005060008154811015600257906000526020600020906002020160005060008201518160000160005055602082015181600101600050559050505b610192806100b76000396000f30060606040523615610074576000357c0100000000000000000000000000000000000000000000000000000000900480630121b93f1461007657806317d7de7c146100895780632e4176cf146100aa5780635c19a95c146100e1578063609ff1bd146100f45780639e7b8d611461011557610074565b005b610087600480359060200150610188565b005b61009460045061014e565b6040518082815260200191505060405180910390f35b6100b5600450610128565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100f2600480359060200150610184565b005b6100ff60045061018c565b6040518082815260200191505060405180910390f35b610126600480359060200150610180565b005b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060016000506000815481101561000257906000526020600020906002020160005060000160005054905080505b90565b5b50565b5b50565b5b50565b60005b9056","symTab":{"proposals":{"atStorageKey":"1","bytesUsed":"20","jsType":"Array","arrayElement":{"bytesUsed":"40","jsType":"Struct","solidityType":"Proposal"},"arrayNewKeyEach":"1","arrayDataStart":"b10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6","solidityType":"Proposal[]"},"delegate":{"functionDomain":[{"atStorageKey":"0","bytesUsed":"14","jsType":"Address","solidityType":"address"}],"functionArgs":["to"],"functionHash":"5c19a95c","bytesUsed":"0","jsType":"Function","solidityType":"function(address) returns ()"},"error":{"atStorageKey":"0","bytesUsed":"20","jsType":"Bytes","solidityType":"bytes32"},"getName":{"functionDomain":[],"functionArgs":[],"functionHash":"17d7de7c","bytesUsed":"0","jsType":"Function","functionReturns":{"atStorageKey":"0","bytesUsed":"20","jsType":"Bytes","solidityType":"bytes32"},"solidityType":"function() returns (bytes32)"},"chairperson":{"atStorageKey":"2","bytesUsed":"14","jsType":"Address","solidityType":"address"},"Proposal":{"bytesUsed":"40","structFields":{"name":{"atStorageKey":"0","bytesUsed":"20","jsType":"Bytes","solidityType":"bytes32"},"voteCount":{"atStorageKey":"1","bytesUsed":"20","jsType":"Int","solidityType":"uint256"}},"jsType":"Struct","solidityType":"struct {bytes32 name; uint256 voteCount}"},"winningProposal":{"functionDomain":[],"functionArgs":[],"functionHash":"609ff1bd","bytesUsed":"0","jsType":"Function","functionReturns":{"atStorageKey":"0","bytesUsed":"20","jsType":"Int","solidityType":"uint256"},"solidityType":"function() returns (uint256)"},"vote":{"functionDomain":[{"atStorageKey":"0","bytesUsed":"20","jsType":"Int","solidityType":"uint256"}],"functionArgs":["proposal"],"functionHash":"0121b93f","bytesUsed":"0","jsType":"Function","solidityType":"function(uint256) returns ()"},"giveRightToVote":{"functionDomain":[{"atStorageKey":"0","bytesUsed":"14","jsType":"Address","solidityType":"address"}],"functionArgs":["voter"],"functionHash":"9e7b8d61","bytesUsed":"0","jsType":"Function","solidityType":"function(address) returns ()"}},"address":"0000000000000000000000000000000000000000"});
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
