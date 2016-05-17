class Collection {

  constructor(ipfs, web3, schema) {
    this.ipfs = ipfs;
    this.web3 = web3;
    this.schema = schema; 
  }

  setSchema(schema) {
    this.schema = schema;
  }

  getSchema() {
    return this.schema;
  }

  checkData(data) {    
    if (typeof this.schema === 'undefined') {
      throw new Error("Cannot set data - no schema set!");
    };
    
    // TODO Errors not propoagating well from subschema
    if (this.schema.errors(data)) {
      console.log(this.schema.errors(data));
      throw new Error(this.schema.errors(data)); 
    };
  }

  addToIPFS(data) {
    return this.ipfs.addJsonAsync(data);
  }

  getTxObj() {
    return {
      from: this.web3.eth.accounts[0],
      gasPrice: this.web3.eth.gasPrice,
      gas: 800000
    } 
  }

  //Hex if 34 bytes - just store 32bytes and assume Qm beginning
  ipfsToEth(hash) {
    let hex = this.ipfs.utils.base58ToHex(hash);
    return '0x' +  hex.substring(4);
  }

  // 1220 is standard hex start for ipfs multihashes (sha256 with 20 character length)
  ethToIpfs(hex) {
    let fullHex = '1220' + hex.substring(2);
    return this.ipfs.utils.hexToBase58(fullHex);
  }
}

export default Collection;
