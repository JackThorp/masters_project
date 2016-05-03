import web3 from '../lib/thirdparty/web3.js' 
let TestContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"num","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"increment","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"}]); 
let TestContractCode  = "0x6060604052600260005560438060156000396000f3606060405260e060020a60003504634e70b1dc81146024578063d09de08a14602c575b005b603960005481565b6022600080546001019055565b6060908152602090f3";
export {TestContract, TestContractCode }