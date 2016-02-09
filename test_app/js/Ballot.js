var blockapps = require("blockapps-js");
var Promise = require("bluebird");
var contract = blockapps.Solidity.attach({"code":"// Voting with delegation\ncontract Ballot {\n\n\t// blocapps won't compile throw for some reason?\n\tbytes32 error;\n\n\tstruct Voter {\n\n\t\tuint weight;\t\t// weight is accumulated by delegation\n\t\tbool voted;\t\t\t// True if person has already voted\n\t\taddress delegate;\t// person delegated to\n\t\tuint vote;\t\t\t// index of vote\n\t}\n\n\t// Type for a single proposal\n\tstruct Proposal {\n\t\tbytes32 name;\t// Short name of proposal\n\t\tuint voteCount;\t// Number of votes\n\t}\n\n\taddress public chairperson;\n\n\t// Create a public map of all the voters\n\tmapping(address => Voter) public voters;\n\n\t// Dynamic array of proposals\n\tProposal[] public proposals;\n\tuint numProposals;\n\n\t// Create a new ballot to choose one of proposalName\n\tfunction SetUp() {\n\n\n\t\tchairperson = msg.sender;\n\t\tvoters[chairperson].weight = 1;\n\n\t\tbytes32[] proposalNames;\n\t\tproposalNames[0] = \"Bernie Sanders\";\n\t\tproposalNames[1] = \"Donald Trump\";\n\t\tproposalNames[2] = \"Hilary Clinton\";\n\t\tproposalNames[3] = \"Kanye West\";\n\n\t\t// TODO create contract with argument? Not currently supported in blockapps??\n\t\t// Add each proposal to the proposals array\n\t\tfor (uint i = 0; i < proposalNames.length; i++) {\n\n\t\t\tproposals[numProposals] = Proposal({\n\t\t\t\tname: proposalNames[i],\n\t\t\t\tvoteCount: 0\n\t\t\t});\n\t\t\tnumProposals++;\n\t\t}\n\t}\n\n\t// Gives a voter the right to vote. Voters may only be added by the chair.\n\tfunction giveRightToVote(address voter) {\n\n\t\tif (msg.sender != chairperson || voters[voter].voted){\n\t\t\n\t\t\t// terminte and revert all changes to ether balance. Also\n\t\t\t// consumes all gas provided.\n\t\t\terror = \"Only chair can add voters\";\n\t\t\treturn;\n\t\t} \n\n\t\tvoters[voter].weight = 1;\n\t}\n\n\t// Delegate vote to somebody else.\n\tfunction delegate(address to) {\n\n\t\tVoter sender = voters[msg.sender];\n\n\t\tif (sender.voted) {\n\t\t\terror = \"Already voted\";\n\t\t\treturn;\n\t\t} \n\t\t\n\t\t// Find the end of the delegation chain.\n\t\t// Stops when delegate field is uninitialised or cycle detected.\n\t\twhile (voters[to].delegate != address(0) && voters[to].delegate != msg.sender) {\n\t\t\tto = voters[to].delegate;\n\t\t}\n\n\t\t// Do not allow self delegation or loops.\n\t\tif (to == msg.sender) {\t\n\t\t\terror = \"Self delegation or cycle found.\";\n\t\t\treturn;\n\t\t}\n\n\t\t// Since `sender` is a reference, this\n        // modifies `voters[msg.sender].voted`\n        sender.voted = true;\n        sender.delegate = to;\n        Voter delegate = voters[to];\n        \n        if (delegate.voted) {\n        \t// If delegate voted then add sender weight to chosen proposal.\n        \tproposals[delegate.vote].voteCount += sender.weight; \n        } else {\n        \t// If delegate not yet voted then add weight to delegate.\n        \tdelegate.weight += sender.weight;\n        }\t\n\t}\n\n\tfunction vote(uint proposal) {\n\n\t\tVoter sender = voters[msg.sender];\n\n\t\tif (sender.voted) { \n\t\t\t\n\t\t\terror = \"Attempt to vote more than once.\"; \n\t\t\treturn;\n\t\t}\n\n\t\tsender.voted = true;\n\t\tsender.vote = proposal;\n\n\t\t// If `proposal` is out of the range of the array, this will throw automatically and revert all changes.\n        proposals[proposal].voteCount += sender.weight;\n\t}\n\n\tfunction winningProposal() constant returns (uint winningProposal) {\n\n\t\tuint winningVoteCount = 0;\n\n\t\tfor (uint p = 0; p < proposals.length; p++) {\n\n\t\t\tif (proposals[p].voteCount > winningVoteCount) {\n\t\t\t\twinningVoteCount = proposals[p].voteCount;\n\t\t\t\twinningProposal = p;\n\t\t\t}\n\t\t}\n\t}\n\n}\n\n\n","name":"Ballot","vmCode":"6060604052610a60806100136000396000f3006060604052361561008a576000357c0100000000000000000000000000000000000000000000000000000000900480630121b93f1461008c578063013cf08b1461009f5780632e4176cf146100cd5780635c19a95c14610104578063609ff1bd146101175780639e7b8d6114610138578063a3ec138d1461014b578063b41181bd1461019d5761008a565b005b61009d6004803590602001506108f2565b005b6100b0600480359060200150610236565b604051808381526020018281526020019250505060405180910390f35b6100d86004506101aa565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101156004803590602001506105ad565b005b6101226004506109d1565b6040518082815260200191505060405180910390f35b6101496004803590602001506104a1565b005b61015c6004803590602001506101d0565b604051808581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200194505050505060405180910390f35b6101a860045061026f565b005b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60026000506020528060005260406000206000915090508060000160005054908060010160009054906101000a900460ff16908060010160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020160005054905084565b60036000508181548110156100025790600052602060002090600202016000915090508060000160005054908060010160005054905082565b6000600033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550600160026000506000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050600001600050819055507f4265726e69652053616e646572730000000000000000000000000000000000008260008154811015610002579060005260206000209001600050819055507f446f6e616c64205472756d7000000000000000000000000000000000000000008260018154811015610002579060005260206000209001600050819055507f48696c61727920436c696e746f6e0000000000000000000000000000000000008260028154811015610002579060005260206000209001600050819055507f4b616e7965205765737400000000000000000000000000000000000000000000826003815481101561000257906000526020600020900160005081905550600090505b815481101561049c5760406040519081016040528083838154811015610002579060005260206000209001600050548152602001600081526020015060036000506004600050548154811015610002579060005260206000209060020201600050600082015181600001600050556020820151816001016000505590505060046000818150548092919060010191905055505b80806001019150506103fc565b5b5050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614158061053a5750600260005060008273ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060010160009054906101000a900460ff165b1561056e577f4f6e6c792063686169722063616e2061646420766f74657273000000000000006000600050819055506105aa565b6001600260005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050600001600050819055505b50565b60006000600260005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005091508160010160009054906101000a900460ff1615610628577f416c726561647920766f746564000000000000000000000000000000000000006000600050819055506108ed565b5b600073ffffffffffffffffffffffffffffffffffffffff16600260005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060010160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415801561073657503373ffffffffffffffffffffffffffffffffffffffff16600260005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060010160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614155b1561079757600260005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060010160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1692508250610629565b3373ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156107fa577f53656c662064656c65676174696f6e206f72206379636c6520666f756e642e006000600050819055506108ed565b60018260010160006101000a81548160ff02191690830217905550828260010160016101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550600260005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005090508060010160009054906101000a900460ff16156108d05781600001600050546003600050826002016000505481548110156100025790600052602060002090600202016000506001016000828282505401925050819055506108ec565b8160000160005054816000016000828282505401925050819055505b5b505050565b6000600260005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005090508060010160009054906101000a900460ff161561096b577f417474656d707420746f20766f7465206d6f7265207468616e206f6e63652e006000600050819055506109cd565b60018160010160006101000a81548160ff02191690830217905550818160020160005081905550806000016000505460036000508381548110156100025790600052602060002090600202016000506001016000828282505401925050819055505b5050565b60006000600060009150600090505b600360005054811015610a5a57816003600050828154811015610002579060005260206000209060020201600050600101600050541115610a4c576003600050818154811015610002579060005260206000209060020201600050600101600050549150815080925082505b5b80806001019150506109e0565b5b50509056","symTab":{"proposals":{"atStorageKey":"3","bytesUsed":"20","jsType":"Array","arrayElement":{"bytesUsed":"40","jsType":"Struct","solidityType":"Proposal"},"arrayNewKeyEach":"1","arrayDataStart":"c2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b","solidityType":"Proposal[]"},"delegate":{"functionDomain":[{"atStorageKey":"0","bytesUsed":"14","jsType":"Address","solidityType":"address"}],"functionArgs":["to"],"functionHash":"5c19a95c","bytesUsed":"0","jsType":"Function","solidityType":"function(address) returns ()"},"SetUp":{"functionDomain":[],"functionArgs":[],"functionHash":"b41181bd","bytesUsed":"0","jsType":"Function","solidityType":"function() returns ()"},"Voter":{"bytesUsed":"60","structFields":{"voted":{"atStorageKey":"1","bytesUsed":"1","jsType":"Bool","solidityType":"bool"},"delegate":{"atStorageKey":"1","bytesUsed":"14","jsType":"Address","atStorageOffset":"1","solidityType":"address"},"weight":{"atStorageKey":"0","bytesUsed":"20","jsType":"Int","solidityType":"uint256"},"vote":{"atStorageKey":"2","bytesUsed":"20","jsType":"Int","solidityType":"uint256"}},"jsType":"Struct","solidityType":"struct {uint256 weight; bool voted; address delegate; uint256 vote}"},"error":{"atStorageKey":"0","bytesUsed":"20","jsType":"Bytes","solidityType":"bytes32"},"chairperson":{"atStorageKey":"1","bytesUsed":"14","jsType":"Address","solidityType":"address"},"Proposal":{"bytesUsed":"40","structFields":{"name":{"atStorageKey":"0","bytesUsed":"20","jsType":"Bytes","solidityType":"bytes32"},"voteCount":{"atStorageKey":"1","bytesUsed":"20","jsType":"Int","solidityType":"uint256"}},"jsType":"Struct","solidityType":"struct {bytes32 name; uint256 voteCount}"},"winningProposal":{"functionDomain":[],"functionArgs":[],"functionHash":"609ff1bd","bytesUsed":"0","jsType":"Function","functionReturns":{"atStorageKey":"0","bytesUsed":"20","jsType":"Int","solidityType":"uint256"},"solidityType":"function() returns (uint256)"},"vote":{"functionDomain":[{"atStorageKey":"0","bytesUsed":"20","jsType":"Int","solidityType":"uint256"}],"functionArgs":["proposal"],"functionHash":"0121b93f","bytesUsed":"0","jsType":"Function","solidityType":"function(uint256) returns ()"},"giveRightToVote":{"functionDomain":[{"atStorageKey":"0","bytesUsed":"14","jsType":"Address","solidityType":"address"}],"functionArgs":["voter"],"functionHash":"9e7b8d61","bytesUsed":"0","jsType":"Function","solidityType":"function(address) returns ()"},"numProposals":{"atStorageKey":"4","bytesUsed":"20","jsType":"Int","solidityType":"uint256"},"voters":{"atStorageKey":"2","mappingKey":{"bytesUsed":"14","jsType":"Address","solidityType":"address"},"bytesUsed":"20","jsType":"Mapping","mappingValue":{"bytesUsed":"60","jsType":"Struct","solidityType":"Voter"},"solidityType":"mapping (address => Voter)"}},"address":"2dbe7ec506e0f3b2160725fc73c279338eb840e6"});
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