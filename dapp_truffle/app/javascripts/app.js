var accounts;
var account;
var balance;

function setData(id, message) {
  var status = document.getElementById(id);
  status.innerHTML = message;
};

function getInfo() {
  var store = SimpleStorage.deployed();

  store.get.call({from: account}).then(function(value) {
    setData("value", value.valueOf());
    return store.getSetter.call({from: account});
  })
  .then(function(addr){
    setData("set_address", addr);
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error getting stored value; see log.");
  });
};

function addMember() {
  var store = SimpleStorage.deployed();

  var value = parseInt(document.getElementById("amount").value);

  setData("status", "Initiating transaction... (please wait)");

  store.set(value, {from: account}).then(function() {
    setData("status","Transaction complete!");
    getInfo();
  }).catch(function(e) {
    console.log(e);
    setData("status", "Error setting value; see log.");
  });
};


function createAccount() {
  
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

  });
}

window.onload = function() {
  
  createAccount(); 
  
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
    
    setData("address", account);

    getInfo();
  });
}
