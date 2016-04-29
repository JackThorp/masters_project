import web3 from '../lib/thirdparty/web3.js' 
let Coop = web3.eth.contract([{"constant":false,"inputs":[{"name":"ipfsHash","type":"bytes"}],"name":"setCoopData","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"getCoopData","outputs":[{"name":"","type":"bytes"}],"type":"function"}]); 
export default Coop;