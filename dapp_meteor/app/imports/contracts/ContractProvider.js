import web3 from '../lib/thirdparty/web3.js' 
let ContractProvider = web3.eth.contract([{"constant":false,"inputs":[{"name":"name","type":"bytes32"}],"name":"contracts","outputs":[{"name":"addr","type":"address"}],"type":"function"}]
); 
let ContractProviderCode  = "606060405260268060106000396000f3606060405260e060020a6000350463ec56a3738114601a575b005b60006060908152602090f3";
export {ContractProvider, ContractProviderCode }