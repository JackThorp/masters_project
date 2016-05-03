import web3 from '../lib/thirdparty/web3.js' 
let CMC = web3.eth.contract([{"constant":false,"inputs":[{"name":"name","type":"bytes32"},{"name":"addr","type":"address"}],"name":"addContract","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"bytes32"}],"name":"removeContract","outputs":[{"name":"result","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"remove","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"name","type":"bytes32"}],"name":"getContract","outputs":[{"name":"addr","type":"address"}],"type":"function"}]); 
let CMCCode  = "0x606060405261055e806100126000396000f3606060405260e060020a60003504635188f996811461003c578063a43e04d814610061578063a7f437791461008b578063e16c7d9814610428575b005b61003a600435602435600054600160a060020a0390811633909116146104ab576104a7565b61044c600435600081815260016020526040812054600160a060020a031681141561050757610447565b61003a6000600060006000600060006000600060009054906101000a9004600160a060020a0316600160a060020a031633600160a060020a03161415610555575050600160205250507f5f9b23e6df429eb1cbda4258e9155c11f858854df274aed8cb8227d191e415bf547fc3089bfb118c951ace1a09713f12fce78663f22f2124755f3c465f1e6963bb3e547f9289b503393b48e23c8b4af278fa7c4b67fe5a648ebb3b051ed46664e2a2175f547f7906b0b45f4cf4068c33d28699d637a73e39f9064f06411f3d10df60f221a6e7547f9f2d44aa38117b94b4ccb804998eadac5362be0781ed10d6a73f1970bb28644c547f859332fc3a930fc459898a74e1d8a04b977feacdd3386ec64ca4c85ffdce83a5547f636f6f7073554b000000000000000000000000000000000000000000000000009096527f39e70947b7d2041436c07482b5beee37a426159b1242c49b328c872778de176154600160a060020a0395861698509385169692851695918516949081169391811692911690871461024c5786600160a060020a031663a7f437796040518160e060020a0281526004018090506000604051808303816000876161da5a03f115610002575050505b600160a060020a0386166000146102995785600160a060020a031663a7f437796040518160e060020a0281526004018090506000604051808303816000876161da5a03f115610002575050505b600160a060020a0385166000146102e65784600160a060020a031663a7f437796040518160e060020a0281526004018090506000604051808303816000876161da5a03f115610002575050505b600160a060020a0384166000146103335783600160a060020a031663a7f437796040518160e060020a0281526004018090506000604051808303816000876161da5a03f115610002575050505b600160a060020a0383166000146103805782600160a060020a031663a7f437796040518160e060020a0281526004018090506000604051808303816000876161da5a03f115610002575050505b600160a060020a0382166000146103cd5781600160a060020a031663a7f437796040518160e060020a0281526004018090506000604051808303816000876161da5a03f115610002575050505b600160a060020a03811660001461041a5780600160a060020a031663a7f437796040518160e060020a0281526004018090506000604051808303816000876161da5a03f115610002575050505b600054600160a060020a0316ff5b61045e600435600081815260016020526040902054600160a060020a03165b919050565b60408051918252519081900360200190f35b60408051600160a060020a03929092168252519081900360200190f35b6000828152600160205260409020805473ffffffffffffffffffffffffffffffffffffffff1916821790555b5050565b80600160a060020a03166321b523dd306040518260e060020a0281526004018082600160a060020a031681526020019150506020604051808303816000876161da5a03f115610002575050604051511515905061047b576104a7565b600054600160a060020a03908116339091161461052357610447565b506000818152600160208190526040909120805473ffffffffffffffffffffffffffffffffffffffff19169055610447565b5050505050505056";
export {CMC, CMCCode }