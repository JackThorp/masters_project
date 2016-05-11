import Promise      from 'bluebird';
import coopSchema   from './coopSchema.js';
import contracts    from '/imports/startup/contracts.js';
import Coop         from '/imports/api/Coop.js';
import { CoopContract, CoopContractCode }     from '/imports/contracts/CoopContract.js';

coopRegistry  = Promise.promisifyAll(contracts.CoopRegistry); 
coopContract  = Promise.promisifyAll(CoopContract);

class Coops {

  constructor(ipfs, web3) {
    this.ipfs = ipfs;
    this.web3 = web3;
  }


  // Fetch data for cooperative with given address
  get(addr) {
 
    getCoopDataAsync = Promise.promisify(coopContract.at(addr).getCoopData);
    return getCoopDataAsync().then(function(ipfsHex) {
    
      if(ipfsHex === "0x") return {}; //throw new Error("No data added for coop at " + addr);  

      // Refactor out somewhere.. . 
      ipfsHash = this.ipfs.utils.hexToBase58(ipfsHex.substring(2));
      return this.ipfs.catJsonAsync(ipfsHash)
    })
    .then(function(coopData) {
      return new Coop(addr, coopData);
    });
  }


  // Fetch all cooperatives from eth-ipfs
  getAll() {
    
    let coops = this;
    return coopRegistry.getCoopsAsync().then(function(coopAddresses) {
      
      var coopsList = [];
      for(var i = 0; i < coopAddresses.length; i++) {
        coopsList.push(coops.get(coopAddresses[i]));        
      }
      return Promise.all(coopsList);
    })
    .catch(function(err) {
      console.log(err);
    });
  }

  
  // Add a new cooperative to eth-ipfs
  add(data) {

    var txObj = {
      from: web3.eth.accounts[0],
      gasPrice: web3.eth.gasPrice,
      gas: 400000
    }
  
    var registeredPromise = coopRegistry.newCoopAsync({});

    ipfs.addJsonAsync(data).then(function(hash) {
      
      var ethHash = '0x' + this.ipfs.utils.base58ToHex(hash);
      txObj.data = CoopContractCode;
     
      return new Promise(function(resolve, reject) {
        coopContract.new(ethHash, txObj, function(err, newCoop) {
          
          if (err) return reject(err); 

          // Only true on second firing
          if(newCoop.address) {
            resolve(newCoop.address);
          }
        });
      });
    })
    .then(function(coopAddr) {
      return coopRegistry.addCoopAsync(coopAddr, txObj);
    })
    .catch(function(err) {
      console.log(err);
    });

    return registeredPromise;
  }

}

export default Coops;
