import web3 from '../lib/thirdparty/web3.js' 
let UserController = web3.eth.contract([{"constant":false,"inputs":[],"name":"addUser","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"}],"name":"getUser","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"updateUser","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"removeUser","outputs":[],"type":"function"}]); 
let UserControllerCode  = "0x606060405260798060106000396000f3606060405260e060020a6000350463455c928c811460385780636f77926b14603c578063f26aa488146038578063f944f4c7146038575b005b6036565b60366004358073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156076575b5056";
export {UserController, UserControllerCode }