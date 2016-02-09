function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      ___header_template = __helpers.l(require.resolve("../header/template")),
      forEach = __helpers.f,
      escapeXmlAttr = __helpers.xa,
      escapeXml = __helpers.x;

  return function render(data, out) {
    out.w('<!DOCTYPE html> <html lang="en">');

    ___header_template.render({}, out);

    out.w('<body><div class="container"><h1>Inspect your Contracts!</h1><div class="row">');

    forEach(data.contractNames, function(contract) {
      out.w('<div><ul class="lead"><li><a href="/contracts/' +
        escapeXmlAttr(contract) +
        '">' +
        escapeXml(contract) +
        '</a></li></ul></div>');
    });

    out.w('</div></div></body></html>');
  };
}
(module.exports = require("marko").c(__filename)).c(create);