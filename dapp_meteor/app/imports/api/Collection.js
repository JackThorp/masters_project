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
    return   }

  getTxObj() {
    return {
      from: this.web3.eth.accounts[0],
      gasPrice: this.web3.eth.gasPrice,
      gas: 1500000
    } 
  }

}

export default Collection;
