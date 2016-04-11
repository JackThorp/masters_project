
// disconnect any meteor server
if(location.host !== 'localhost:3000' 
   && location.host !== '127.0.0.1:3000' 
   && typeof MochaWeb === 'undefined')
    Meteor.disconnect();


// Set the default unit to ether
// Localstore is from frozeman:storage. Simply a wrapper for localStorage
if(!LocalStore.get('etherUnit'))
    LocalStore.set('etherUnit', 'ether');


// Set Session default values for components
// Session is a core package of Meteor. It is reactive...
if (Meteor.isClient) {
	Session.setDefault('balance', '0');
}

// Meteor.startup executed when everything else loaded into DOM 
Meteor.startup(function() {
    
    // make sure _ is lodash not underscore
    _ = lodash;

    // TODO - work out how to set/find provider for production.
    if(!web3.currentProvider)
        web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
    
    // EthAccounts package
    // Balances autmoatically updated and stored in localstorage :)
    EthAccounts.init();
    
    // Get ethbase account, set it is primary.
    // Set info for ethbase account.
    web3.eth.defaultAccount = web3.eth.coinbase;

    // SET default language
    // Cookie is package from chuangbo - 
    // TAPi18n is the internationalisation package.
    if(Cookie.get('TAPi18next')) {
        TAPi18n.setLanguage(Cookie.get('TAPi18next'));
    } else {

        // navigator object is js feature - info about browser.
        var userLang = navigator.language || navigator.userLanguage,
        availLang = TAPi18n.getLanguages();

        // set default language
        if (_.isObject(availLang) && availLang[userLang]) {
            TAPi18n.setLanguage(userLang);
            // lang = userLang; 
        } else if (_.isObject(availLang) && availLang[userLang.substr(0,2)]) {
            TAPi18n.setLanguage(userLang.substr(0,2));
            // lang = userLang.substr(0,2);
        } else {
            TAPi18n.setLanguage('en');
            // lang = 'en';
        }
    }

    // Setup Moment and Numeral i18n support
    // Tracker is core meteor package that tracks dependcies for reactivity.
    // autorun executes function each time dependent data changes.
    Tracker.autorun(function(){
        if(_.isString(TAPi18n.getLanguage())) {
            
            // moment package is for dates
            moment.locale(TAPi18n.getLanguage().substr(0,2));
            
            // numeral for formatting and manipulating numbers.
            numeral.language(TAPi18n.getLanguage().substr(0,2));
        }
    });	

	// Set Meta Title
  // Meta is external package to help manage meta tags on page.
	Meta.setTitle(TAPi18n.__("dapp.app.title"));
});
