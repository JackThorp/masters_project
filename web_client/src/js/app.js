var conf = require('configuration');
var Web3 = require('web3');

web3 = new Web3(new Web3.providers.HttpProvider("http://" + conf.api + ":8545"));

window.setInterval(printBlockNumber, 1000);

function printBlockNumber() {
  web3.eth.getBlockNumber(function (err, res) {
    console.log(res);
    //ractive.set({ blockNo: res });
  });
};


console.log('api is: ' + conf.api);
