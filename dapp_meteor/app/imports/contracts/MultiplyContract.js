import web3 from '../lib/thirdparty/web3.js' 
let MultiplyContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"a","type":"uint256"}],"name":"multiply","outputs":[{"name":"d","type":"uint256"}],"type":"function"}]); 
export default MultiplyContract;