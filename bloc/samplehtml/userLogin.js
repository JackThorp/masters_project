function retrieveUser(userObj,callback) {
        var oReq = new XMLHttpRequest();
        oReq.open("POST", "https://strato-dev.blockapps.net/eth/v1.0/login", true);

        var params = "app="+encodeURIComponent(userObj.app)
                       +"&email="+encodeURIComponent(userObj.email)
                       +"&loginpass=" + encodeURIComponent(userObj.loginpass)
                       +"&address=" + encodeURIComponent(userObj.address);     
 
        oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        oReq.onreadystatechange = function () {
          if (oReq.readyState == 4) {
            if (oReq.status === 200) {
               
              var jsonResp = JSON.parse(this.responseText);
              // assume we have ethlightjs
              console.log('retrieved: ' + jsonResp.encryptedWallet);
              keystore = ethlightjs.keystore.deserialize(jsonResp.encryptedWallet);

              callback(keystore);       
             } else {
              console.log("error: " +  oReq.statusText);
            }
          } 
        }
        oReq.send(params);
  }
