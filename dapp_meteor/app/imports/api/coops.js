import Promise      from 'bluebird';
import coopSchema   from './coopSchema.js';
import contracts    from '/imports/startup/contracts.js';
import { Coop, CoopCode }     from '/imports/contracts/Coop.js';

coopRegistry  = Promise.promisifyAll(contracts.CoopRegistry); 
coopContract  = Promise.promisifyAll(Coop);

class Coops {

  constructor(_ipfs, _web3) {
    this.ipfs = _ipfs;
    this.web3 = _web3;
  }


  // Fetch data for cooperative with given address
  get(addr) {
  
    getCoopDataAsync = Promise.promisify(coopContract.at(addr).getCoopData);
    return getCoopDataAsync().then(function(ipfsHex) {
      
      // Refactor out somewhere.. . 
      ipfsHash = this.ipfs.utils.hexToBase58(ipfsHex.substring(2));
      return ipfs.catJsonAsync(ipfsHash)
    })
    .then(function(coopData) {
      return coopData;
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
      ethHash = '0x' + ipfs.utils.base58ToHex(hash);
      txObj.data = CoopCode;
      
      return new Promise(function(resolve, reject) {
        coopContract.new(ethHash, txObj, function(err, newCoop) {
          if (err) { return reject(err); }

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
