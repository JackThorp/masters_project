function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXmlAttr = __helpers.xa,
      escapeXml = __helpers.x;

  return function render(data, out) {
    out.w('<script src="' +
      escapeXmlAttr(data.apiURL) +
      '/static/js/ethlightjs.min.js"></script><script src="' +
      escapeXmlAttr(data.apiURL) +
      '/static/js/api.js"></script><script>\n\nvar blockapps = require("blockapps-js");\nvar Promise = require("bluebird");\n\nvar globalKeystore;\nvar globalPassword = \'' +
      escapeXml(data.globalPassword) +
      '\';\n\nvar contract = blockapps.Solidity.attach( ' +
      escapeXml(JSON.stringify(data.contractMeta)) +
      ' );\nblockapps.query.serverURI = \'' +
      escapeXml(data.apiURL) +
      '\';\n\nvar Units = blockapps.ethbase.Units;\n\n' +
      escapeXml(data.txFailedHandlerCode) +
      ';\n\nfunction callFunc(funcName) {\n    if (typeof ethlightjs === \'undefined\') {\n        ethlightjs = lightwallet;\n    }\n\n    var usableKeystore = ethlightjs.keystore.deserialize(JSON.stringify(globalKeystore[0]));\n\n    try {\n        var privkey = usableKeystore.exportPrivateKey(usableKeystore.addresses[0], globalPassword);\n        console.log("privkey: " + privkey);\n    } catch (e) {\n        console.log("failed with: " + e);\n        ' +
      escapeXml(data.txFailedHandlerName) +
      '(e);\n    }\n\n    var args = [];\n    var funcDivElts = document.getElementById(funcName + "Div").children;\n    var len = funcDivElts.length;\n\n    for (var i = 1; i < len-1; ++i) { // Skip the button and the value text input\n        args.push(funcDivElts[i].value);\n    }\n\n    console.log("about to call function: " + funcName + " with args: " + args);\n    console.log("eth value sent: " + Units.ethValue(funcDivElts[len-1].value).in("ether"));\n\n    contract.state[funcName].apply(null,args).txParams({\n        value : Units.ethValue(funcDivElts[len-1].value).in("ether")\n    }).callFrom(privkey).then(afterTX).catch(function (err) { console.log("err: " + err); });\n}\n\nfunction storageAfterTX(result) {\n    var afterTXstring = "TX returned: " +\n        ((result === undefined) ? "(nothing)":result);\n\n    return Promise.props(contract.state).then(function(sVars) {\n        afterTXstring += "\\n\\n Contract storage state:\\n\\n";\n        for (name in sVars) {\n            var svar = sVars[name]\n            if (typeof svar === "function") {\n                continue;\n            }\n            afterTXstring += "  " + name + " = " + svar + "\\n";\n        };\n      return afterTXstring;  \n    });\n} \n\nfunction contractBalanceAfterTX(txString) {\n    return contract.account.balance.then(function(bal) {\n        return txString + "\\n Contract balance =  " +\n            Units.convertEth(bal).from("wei").to("ether") + " ether\\n";\n    });\n}\n\nfunction userBalanceAfterTX(txString) {\n    return blockapps.ethbase.Account(globalKeystore[0].addresses[0]).balance.then(function(userBal) {\n        return txString + "\\n Your balance     =  " +\n            Units.convertEth(userBal).from("wei").to("ether") + " ether\\n";\n    });\n}\n\nfunction resetTextArea(txString)  {\n    document.getElementById("afterTXarea").textContent = txString;\n}\n\nfunction afterTX(result) {\n    storageAfterTX(result)\n      .then(function (txStr) { \n          return contractBalanceAfterTX(txStr);\n        })\n      .then(function (txStr) { \n          return userBalanceAfterTX(txStr);\n        })\n      .then(function (txStr) { \n          resetTextArea(txStr);\n      }).catch(function (err) {\n          console.log("error caught: " + err); \n      });\n} \n</script>');
  };
}
(module.exports = require("marko").c(__filename)).c(create);