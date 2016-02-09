function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXmlAttr = __helpers.xa,
      escapeXml = __helpers.x;

  return function render(data, out) {
    out.w('<script src="' +
      escapeXmlAttr(data.apiURL) +
      '/static/js/ethlightjs.min.js"></script><div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" id="passwordModal"><div class="modal-dialog modal-sm"><div class="modal-content"><form id="submitPass" action="/login"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">Keystore Password</h4></div><div class="modal-body row"><p class="col-xs-12">Retrieved your key. Enter your password to sign transactions:</p><div class="col-xs-12"><input class="form-control" type="password" id="walletDecrypt" name="password"></div></div><div class="modal-footer"><button id="submitPassButton" class="btn btn-primary col-sm-4" data-target="#passwordModal">Submit</button></div></form></div></div></div><script>\n\n\n\n$(\'#submitPassButton\').on(\'click\',function(e){\n    e.preventDefault();\n    globalPassword = walletDecrypt.value;\n\n    if (typeof ethlightjs === \'undefined\') {\n        ethlightjs = lightwallet;\n    }\n\n    var usableKeystore = ethlightjs.keystore.deserialize(JSON.stringify(globalKeystore[0]));\n    var success = true;\n\n    try {\n\n      var privkey = usableKeystore.exportPrivateKey(usableKeystore.addresses[0], globalPassword);\n\n    } catch (e) {\n\n        success = false;\n        console.log("failed with: " + e);\n        ' +
      escapeXml(data.txFailedHandlerName) +
      '(e);\n\n    }\n\n    if(success){\n\n        $("#passwordModal").modal(\'hide\')\n\n        $.ajax({\n          type     : "POST",\n          url      : "/login",\n          data     : { password: $(this).value },\n          success  : function(data) {\n             alert("successfully logged in!");\n          }\n\n      });\n    } else {\n      console.log("the password is wrong")\n        // TODO update DIV with "wrong password"\n    }\n\n\n});\n\n</script>');
  };
}
(module.exports = require("marko").c(__filename)).c(create);