import Promise      from 'bluebird';
import Collection   from  './Collection.js';
import coopSchema   from './coopSchema.js';
import contracts    from '/imports/startup/contracts.js';
import Coop         from '/imports/api/Coop.js';
import db           from './db.js';
import { CoopContract, CoopContractCode }     from '/imports/contracts/CoopContract.js';
import { Tracker }  from 'meteor/tracker';

coopRegistry  = Promise.promisifyAll(contracts.CoopRegistry); 
coopContract  = Promise.promisifyAll(CoopContract);

class Coops extends Collection {

  constructor(ipfs, web3, schema, membershipReactor, coopReactor) {
    super(ipfs, web3, schema);
    this.membershipReactor  = membershipReactor;
    this.coopReactor        = coopReactor;
    //this.coops = {};
  }
  
  // Fetch data for cooperative with given address
  get(addr) {
    
    // Register reactive dependency here. Asynchronous callbacks will have different context!
    let dep = new Tracker.Dependency;
    dep.depend();
    this.membershipReactor.register(dep, addr);

    let coopData = {};
    let fee, quorum = 0;

    let coopInstance = Promise.promisifyAll(coopContract.at(addr));
    return coopInstance.getCoopDataAsync().then((hash) => {
    
      if(hash === "0x") return; //throw new Error("No data added for coop at " + addr);  

      ipfsHash = db.ethToIpfs(hash);
      return this.ipfs.catJsonAsync(ipfsHash)
    })
    .then((_coopData) => {
      coopData = _coopData;
      return coopInstance.membershipFeeAsync();
    })
    .then((_fee) => {
      fee = _fee;
      return coopInstance.quorumAsync();
    })
    .then((_quorum) => {
      quorum = _quorum;
      return coopInstance.normalResAsync();
    })
    .then((normalRes) => {
      return new Coop(addr, coopData, fee, quorum, normalRes, this.ipfs, dep);
    });

  }


  // Fetch all cooperatives from eth-ipfs
  getAll() {
    
    let coops = this;
    
    // Make reactive to new coop event
    let dep = new Tracker.Dependency;
    dep.depend();
    coops.coopReactor.register(dep);

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

  
  /* Adds coop data to IPFS
   * Creates a new coop contract with data and fee
   * Returns a coop object.
   */
  add(data, fee, quorum, nRes) {

    this.checkData(data); 
    
    var registeredPromise = coopRegistry.newRegistrationAsync({});

    this.ipfs.addJsonAsync(data).then((hash) => {
      var ethHash = db.ipfsToEth(hash);
      return coopRegistry.newCoopAsync(ethHash, fee, quorum, nRes, this.getTxObj());
    })
    .catch((err) => {
      console.log(err);
    });

    return registeredPromise.then(function(coopEvent) {
      let address = coopEvent.args._coop;
      return new Coop(address, data, fee, quorum, nRes, this.ipfs);
    });
  }

}

export default Coops;
