var accounts;
var account;
var balance;


function getOrganisations() {
  var goop = Goop.deployed();
  console.log(goop) 
  
  goop.newOrganisation("imperial", {from: account}).then(function(res){
    console.log(res);
  })
  .then(function(){
    goop.organisations().then(function(res) {
      console.log(res);
    });
  });

}

window.onload = function() {
   
  // generate a new BIP32 12-word seed
  var secretSeed = lightwallet.keystore.generateRandomSeed();

  // the seed is stored encrypted by a user-defined password
  var password = prompt('Enter password for encryption', 'password');
  lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {

    var ks = new lightwallet.keystore(secretSeed, pwDerivedKey);

    // generate five new address/private key pairs
    // the corresponding private keys are also encrypted
    ks.generateNewAddress(pwDerivedKey, 5);
    var addr = ks.getAddresses();

    // Create a custom passwordProvider to prompt the user to enter their
    // password whenever the hooked web3 provider issues a sendTransaction
    // call.
    ks.passwordProvider = function (callback) {
      var pw = prompt("Please enter password", "Password");
      callback(null, pw);
    };

    web3.setProvider(new HookedWeb3Provider({
      host: "http://localhost:8545",
      transaction_signer: ks
    }));

    web3.eth.getAccounts(function(err, accs) {
      
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      getOrganisations();
    
    });
  });
}
