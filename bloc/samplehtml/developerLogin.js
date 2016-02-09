function retrieveLoginData(developerObj,callback) {
    var oReq = new XMLHttpRequest();
    oReq.open("POST", "https://strato-dev.blockapps.net/eth/v1.0/developer", true);

    var params = "app="+encodeURIComponent(developerObj.app)
               +"&email="+encodeURIComponent(developerObj.email)
               +"&loginpass="+encodeURIComponent(developerObj.loginpass);

    oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    oReq.onreadystatechange = function () {
	if (oReq.readyState == 4) {
	    if (oReq.status === 200) {
          callback(oReq.responseText)
	    } else {
		  console.log("error: " +  oReq.statusText);
	    }
	}
    }
    oReq.send(params);
}
