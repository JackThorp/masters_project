for(var i = 0; i < eth.accounts.length; i++) {
  personal.unlockAccount(eth.accounts[i], "pass", 10000);
}
