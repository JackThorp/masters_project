function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      ___header_template = __helpers.l(require.resolve("../header/template")),
      ___globalKeystore_template = __helpers.l(require.resolve("../globalKeystore/template")),
      ___contractJS_template = __helpers.l(require.resolve("../contractJS/template")),
      ___contractFunctionsCall_template = __helpers.l(require.resolve("../contractFunctionsCall/template")),
      ___contractStatus_template = __helpers.l(require.resolve("../contractStatus/template")),
      ___loginStatus_template = __helpers.l(require.resolve("../loginStatus/template"));

  return function render(data, out) {
    out.w('<!DOCTYPE html> <html lang="en">');

    ___header_template.render({}, out);

    ___globalKeystore_template.render({"keys": data.keys, "apiURL": data.apiURL}, out);

    ___contractJS_template.render({"apiURL": data.apiURL, "contractMeta": data.contractMeta, "txFailedHandlerName": data.txFailedHandlerName, "txFailedHandlerCode": data.txFailedHandlerCode, "globalPassword": data.globalPassword}, out);

    out.w('<body><div class="container"><div class="row"><div class="col-md-9" id="functionsDiv">');

    ___contractFunctionsCall_template.render({"contractMeta": data.contractMeta, "body": __helpers.c(out, function() {
    })}, out);

    out.w('</div><div class="col-md-3">');

    ___contractStatus_template.render({"contractMeta": data.contractMeta}, out);

    ___loginStatus_template.render({"globalPassword": data.globalPassword}, out);

    out.w('</div></div> </div> </body><script>\n$( document ).ready( afterTX() );\n</script></html>');
  };
}
(module.exports = require("marko").c(__filename)).c(create);