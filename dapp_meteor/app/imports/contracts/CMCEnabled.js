import web3 from '../lib/thirdparty/web3.js' 
let CMCEnabled = web3.eth.contract([{"constant":false,"inputs":[{"name":"CMCAddr","type":"address"}],"name":"setCMCAddress","outputs":[{"name":"result","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"remove","outputs":[],"type":"function"}]); 
export default CMCEnabled;