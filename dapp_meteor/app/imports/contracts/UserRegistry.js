import web3 from '../lib/thirdparty/web3.js' 
let UserRegistry = web3.eth.contract([{"constant":false,"inputs":[{"name":"user","type":"address"},{"name":"ipfsHash","type":"bytes"}],"name":"setUserData","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"getUserData","outputs":[{"name":"","type":"bytes"}],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_addr","type":"address"}],"name":"UserAdded","type":"event"}]); 
let UserRegistryCode  = "6060604052610331806100126000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480632768ae1314610044578063ffc9896b146100a357610042565b005b6100a16004808035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610127565b005b6100b96004808035906020019091905050610249565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101195780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b80600060005060008473ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101a057805160ff19168380011785556101d1565b828001600101855582156101d1579182015b828111156101d05782518260005055916020019190600101906101b2565b5b5090506101fc91906101de565b808211156101f857600081815060009055506001016101de565b5090565b50508173ffffffffffffffffffffffffffffffffffffffff167f19ef9a4877199f89440a26acb26895ec02ed86f2df1aeaa90dc18041b892f71f60405180905060405180910390a25b5050565b6020604051908101604052806000815260200150600060005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103205780601f106102f557610100808354040283529160200191610320565b820191906000526020600020905b81548152906001019060200180831161030357829003601f168201915b5050505050905061032c565b91905056";
export {UserRegistry, UserRegistryCode }