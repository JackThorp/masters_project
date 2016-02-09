
var units = require('blockapps-js').ethbase.Units;
var ethValue = require('blockapps-js').ethbase.Units.ethValue;

var scaffoldApp = { 
    properties: {
        appName: {
            message: "Enter the name of your app",
            required: true
        },
        
        developer: {
            message: "Enter your name",
            required: true
        },

        email: { 
            message: "Enter your email",
            required: true
        },

        appURL: {
            message: "Enter the URL for your app",
            required: true
        },

        repo: {
            message: "Enter the repo for your app (optional)",
            required: false
        },

        apiURL: {
            message: "Enter the BlockApps API URL you are using or ENTER for default",
            required: false,
            pattern: '[^,\/]$',
            default: 'http://strato-dev2.blockapps.net'
        },

        transferGasLimit: { 
            message: "Enter the default gas limit for value transactions or ENTER for default",
            required: true,
            default: 21000
        },
  
        contractGasLimit: {
            message: "Enter the default contract gas limit or ENTER for default",
            required: true,
            default: 10000000
        },

        gasPrice: {
            message: "Enter the default gas price (in Wei) or ENTER for default",
            required: true,
            default: 50000000000
        }
        
    }
};


var createPassword = { 
    properties: {
        password: {
            message: "Enter a high entropy password. You will need this to sign transactions",
            hidden: true,
            required: true
        }
    }
};

var registerPassword = { 
    properties: {
        password: {
            message: "Enter password for app store",
            hidden: true,
            required: true
        }
    }
};

var requestPassword = { 
    properties: {
        password: {
            message: "Enter password to decrypt key file",
            hidden: true,
            required: true
        }
    }
  };

var transfer = { 
  properties: {
      password: {
        message: "Enter password to decrypt key file and sign transaction",
        hidden: true,
        required: true
      },
   
      to: {
        message: "Enter the address to which to transfer the Ether",
        required: true
      },

      unit: {
        message: "Enter the unit of value you wish to transfer",
        required: true,
        default: "ether"
      },

      value: {
        message: "Enter the amount of value to be transferred",
        required: true
      },

      gasLimit: {
        message: "Enter the gas limit for your transaction",
        required: true,
        default: 22000
      },      

      gasPrice: {
        message: "Enter the gas price for your transaction",
        required: true,
        default: 50000000000
      },
    }
  };

var confirmTransfer = function(promptObj) {

  console.log("preparing to send " 
                         + ethValue(parseInt(promptObj.value)).in(promptObj.unit) 
                         + " wei to " + promptObj.to 
                         + " plus a maximal gas fee of " + promptObj.gasLimit * promptObj.gasPrice / units.unitSchema.ether + " ether");
  return {
    properties : {
      password : {
        message : "Type your password again to confirm the transfer",
        hidden : true,
        required : true,
        conform: function (pass) {
          return (promptObj.password === pass);
        } 
     }
   }
 };
}

module.exports = (function () {
  return {
    scaffoldApp : scaffoldApp,
    createPassword : createPassword,
    registerPassword : registerPassword,
    requestPassword : requestPassword,
    transfer : transfer,
    confirmTransfer : confirmTransfer,
  };
})();
