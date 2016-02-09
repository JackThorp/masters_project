require('marko/node-require').install();

var express = require('express');
var router = express.Router();
var contractHelpers = require('../lib/contract-helpers.js');
var theTemplate = require('../components/keyStatus/template.marko');

router.get('/', function(req, res) {
    contractHelpers.keysStream()
      .pipe(contractHelpers.collect())
        .on('data', function (data) { 
                      var keyData = {};
                      keyData.keys = data;
                      theTemplate.render(keyData, res);
                 });
});

module.exports = router;
