
// callback in case 
function genKey(pass, callback) {
   // assume we script src'd ethlightjs
   var randomSeed = ethlightjs.keystore.generateRandomSeed();
   var keystore = new ethlightjs.keystore(randomSeed,keypass.value);
   var addr = keystore.generateNewAddress(keypass.value);
   callback(keystore); 
}

function submitUser(userObj,callback) {
        var oReq = new XMLHttpRequest();
        oReq.open("POST", "https://strato-dev.blockapps.net/eth/v1.0/wallet", true);

        var params = "app="+encodeURIComponent(userObj.app)
                       +"&email="+encodeURIComponent(userObj.email)
                       +"&loginpass=" + encodeURIComponent(userObj.loginpass)
                       +"&address=" + encodeURIComponent(userObj.address)
                       +"&enckey=" + encodeURIComponent(userObj.enckey);
 
 
        console.log("params: " + params);
        oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        oReq.onreadystatechange = function () {
          if (oReq.readyState == 4) {
            if (oReq.status === 200) {
            		callback(oReq.responseText);
             } else {
                console.log("error", oReq.statusText);
            }
          } 
        }
        oReq.send(params);
  }
