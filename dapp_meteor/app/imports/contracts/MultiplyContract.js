import web3 from '../lib/thirdparty/web3.js' 
let MultiplyContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"a","type":"uint256"}],"name":"multiply","outputs":[{"name":"d","type":"uint256"}],"type":"function"}]); 
let MultiplyContractCode  = "606060405260728060106000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063c6888fa1146037576035565b005b604b60048080359060200190919050506061565b6040518082815260200191505060405180910390f35b6000600782029050606d565b91905056";
export {MultiplyContract, MultiplyContractCode }