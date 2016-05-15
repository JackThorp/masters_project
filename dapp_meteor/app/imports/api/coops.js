import Promise      from 'bluebird';
import Collection   from  './Collection.js';
import coopSchema   from './coopSchema.js';
import contracts    from '/imports/startup/contracts.js';
import Coop         from '/imports/api/Coop.js';
import { CoopContract, CoopContractCode }     from '/imports/contracts/CoopContract.js';
import { Tracker }  from 'meteor/tracker';

coopRegistry  = Promise.promisifyAll(contracts.CoopRegistry); 
coopContract  = Promise.promisifyAll(CoopContract);

class Coops extends Collection {

  constructor(ipfs, web3, schema, membershipReactor, coopReactor) {
    super(ipfs, web3, schema);
    this.membershipReactor  = membershipReactor;
    this.coopReactor        = coopReactor;
  }
  
  // Fetch data for cooperative with given address
  get(addr) {
    
    // Register reactive dependency here. Asynchronous callbacks will have different context!
    let dep = new Tracker.Dependency;
    dep.depend();
    this.membershipReactor.register(dep, addr);

    getCoopDataAsync = Promise.promisify(coopContract.at(addr).getCoopData);
    return getCoopDataAsync().then((hash) => {
    
      if(hash === "0x") return {}; //throw new Error("No data added for coop at " + addr);  

      ipfsHash = this.ethToIpfs(hash);
      return this.ipfs.catJsonAsync(ipfsHash)
    })
    .then((coopData) => {
      return new Coop(addr, coopData);
    });
  }


  // Fetch all cooperatives from eth-ipfs
  getAll() {
    
    let coops = this;
    
    // Make reactive to new coop event
    let dep = new Tracker.Dependency;
    dep.depend();
    this.coopReactor.register(dep);

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

    // Check against schema
    // TODO How to catch this error? ? 
    this.checkData(data); 
    
    var registeredPromise = coopRegistry.newCoopAsync({});
    this.addToIPFS(data).then((hash) => {
      
      var ethHash = this.ipfsToEth(hash);
      var txObj   = this.getTxObj(); 
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
    .then((coopAddr) => {
      return coopRegistry.addCoopAsync(coopAddr, this.getTxObj());
    })
    .catch((err) => {
      console.log(err);
    });

    return registeredPromise;
  }

}

export default Coops;