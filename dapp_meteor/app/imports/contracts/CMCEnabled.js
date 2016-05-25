import web3 from '../lib/thirdparty/web3.js' 
let CMCEnabled = web3.eth.contract([{"constant":false,"inputs":[{"name":"CMCAddr","type":"address"}],"name":"setCMCAddress","outputs":[{"name":"result","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"remove","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"name","type":"bytes32"}],"name":"checkSender","outputs":[{"name":"","type":"bool"}],"type":"function"}]
); 
let CMCEnabledCode  = "606060405261015f806100126000396000f3606060405260e060020a600035046321b523dd8114610031578063a7f437791461006b578063ab90cae114610093575b005b61012660043560008054600160a060020a031681148015906100615750805433600160a060020a03908116911614155b1561013a5761015a565b61002f60005433600160a060020a039081169116141561013857600054600160a060020a0316ff5b61012660043560243560008054600160a060020a0316811480159061011f575080547fec56a3730000000000000000000000000000000000000000000000000000000060609081526064849052600160a060020a039091169063ec56a3739060849060209060248187876161da5a03f11561000257505060405151600160a060020a0380861691161490505b9392505050565b60408051918252519081900360200190f35b565b805473ffffffffffffffffffffffffffffffffffffffff19168217905560015b91905056";
export {CMCEnabled, CMCEnabledCode }