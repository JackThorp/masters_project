import web3 from '../lib/thirdparty/web3.js' 
let MultiplyContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"a","type":"uint256"}],"name":"multiply","outputs":[{"name":"d","type":"uint256"}],"type":"function"}]); 
let MultiplyContractCode  = "0x6060604052602a8060106000396000f3606060405260e060020a6000350463c6888fa18114601a575b005b6007600435026060908152602090f3";
export {MultiplyContract, MultiplyContractCode }