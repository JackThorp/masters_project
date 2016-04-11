/**
Template Controllers

@module Templates
*/

/**
The view3 template

@class [template] views_view3
@constructor
*/

Template['views_welcome'].onCreated(function() {
	  //Meta.setSuffix(TAPi18n.__("dapp.home.title"));
    accounts = EthAccounts.find();
});

Template['views_welcome'].rendered = function() {
  
  var template = this;

  objects.contracts.UserDB.users(this.userAddress, function(err, result) {
    console.log(result);
    TemplateVar.set(template, 'userInfo', result);      
  });
};

// TODO Fetch basic user info from storage?
Template['views_welcome'].helpers({
 
  //TODO set this in local storage?
  userAddress: function() {
    return web3.eth.defaultAccount;
  },

  name: "Jolly Rodger"

});

//TODO Create User Button!!!


