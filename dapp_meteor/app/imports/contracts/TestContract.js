import web3 from '../lib/thirdparty/web3.js' 
let TestContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"num","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"increment","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"}]); 
export default TestContract;