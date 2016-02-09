function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      forEach = __helpers.f,
      escapeXml = __helpers.x;

  return function render(data, out) {
    out.w('<div class="container"><div class="form-group"><label for="sel1">Select Keystore by Address</label><select class="form-control" id="globalKeystoreId" onchange="keyChangeHandler(this.value)">');

    forEach(data.keys, function(key) {
      out.w('<option> ' +
        escapeXml(key.addresses) +
        ' </option>');
    });

    out.w('</select></div></div><script>\nfunction keyChangeHandler(address) { \n  console.log(\'address is currently: \' + address);\n  keyArray = ' +
      escapeXml(JSON.stringify(data.keys)) +
      ';\n  globalKeystore = keyArray.filter(function (key)  {\n     return (key.addresses[0] == address);\n  });\n  console.log(\'global keystore set: \' + JSON.stringify(globalKeystore));\n  $(\'#passwordModal\').modal(\'show\'); \n  afterTX();\n}\n\n$( document ).ready( function () {\n  keyChangeHandler(globalKeystoreId.value);\n});\n</script>');
  };
}
(module.exports = require("marko").c(__filename)).c(create);