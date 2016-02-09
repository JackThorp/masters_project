var express = require('express');
var router = express.Router();
var helper = require('../lib/contract-helpers.js');
var es = require('event-stream');

require('marko/node-require').install();
var homeTemplate = require('marko').load(require.resolve('../components/home/home.marko'));

// assuming existence of global session

router.get('/', function (req, res) {
  console.log(req.session);
  if (typeof req.session.globalPassword == null) req.session.globalPassword = null;

  var contractNameStream =  helper.contractsStream()
     .pipe(helper.collect())
     .pipe( es.map(function (data,cb) {
                      var contractData = {};
                      contractData.contracts = data;
                      cb(null,contractData);
                   }));

  var contractMetaStream =  helper.contractsMetaStream()
     .pipe(helper.collect())
     .pipe( es.map(function (data,cb) {
                      var contractData = {};
                      contractData.contractMeta = data;
                      cb(null,contractData);
                   }));

   helper.fuseStream([contractNameStream,contractMetaStream])
       .on('data', function (data) {
                      data.contractNames = [];
                      data.contracts.forEach(function(value, index){
                        data.contractNames.push(value.slice(0,-4));
                      });
                      homeTemplate.render(data, res);
                   });

});

module.exports = router;
