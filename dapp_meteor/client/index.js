// Start up is first function to be called after page load?
// TODO learn more about meteor structure.

Meteor.startup(function() {
  
  // set providor, which should be a geth node
  // my RPC settings are: 
  // geth --rpc --rpcaddr="0.0.0.0" --rpccorsdomain="*" --mine --unlock=YOUR_ACCOUNT --verbosity=5 --maxpeers=0 --minerthreads="3"
  //if(!web3.currentProvider)
  //    web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
    

});
