var express = require('express');
var contractHelpers = require('../lib/contract-helpers.js');
var router = express.Router();

// should convert contract processing to middleware, I guess
// maybe that's true for the chaining, too?

router.get('/:contractName', function (req, res) {
  var contractLookup = contractHelpers.contractLookup;
  var contractJSONLookup = contractHelpers.contractJSONLookup;
  var keyJSONLookup = contractHelpers.keyJSONLookup;

  var contractName = req.params.contractName;
  var contractNameSol = contractName + '.sol';
  var globalPassword = req.session.globalPassword;

  contractLookup(contractName)
   .then(
        function (contractTemplateObj) {
          return contractJSONLookup(contractTemplateObj);
        }
    ).then(
        function (contractTemplateObj) {
          return keyJSONLookup(contractTemplateObj);
        }
    ).then(
        function (contractTemplateObj) {
          contractTemplateObj.globalPassword = globalPassword;
          contractTemplateObj.isLoggedInMessage = "Status: you are logged in and can sign transactions";
          contractTemplateObj.isNotLoggedInMessage = "Status: you are not logged in, and need to do so to sign transactions. Those buttons won't work yet!";
          contractTemplateObj.title = "Viewing " + contractTemplateObj.contractNameSol;
          contractTemplateObj.txFailedHandlerCode = "function txFailHandler(e) { $('#passwordModal').modal('show'); }";
          contractTemplateObj.txFailedHandlerName = "txFailHandler";

          res.render(contractName, contractTemplateObj);
        }
    ).catch(function(err) {
          console.log("short circuited with status: " + err);
          contractTemplateObj = JSON.parse(err.message);
          contractTemplateObj.globalPassword = globalPassword;
          contractTemplateObj.isLoggedInMessage = "Status: you are logged in and can sign transactions";
          contractTemplateObj.isNotLoggedInMessage = "Status: you are not logged in, and need to do so to sign transactions.";
          if (contractTemplateObj.contractExists) contractTemplateObj.title = "Viewing " + contractNameSol;
          else contractTemplateObj.title = "Viewing Non-Existent Contract ;)";

          contractTemplateObj.txFailedHandlerCode = "function txFailHandler(e) { $('#passwordModal').modal('show'); }";
          contractTemplateObj.txFailedHandlerName = "txFailHandler";

          res.render(contractName, contractTemplateObj); // only the SimpleDataFeed template for now
        }
    );
});


module.exports = router;
