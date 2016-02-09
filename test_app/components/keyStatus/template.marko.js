function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      forEach = __helpers.f,
      escapeXml = __helpers.x;

  return function render(data, out) {
    forEach(data.keys, function(key) {
      out.w('<div><h2> ' +
        escapeXml(key.addresses) +
        ' </h2></div>');
    });
  };
}
(module.exports = require("marko").c(__filename)).c(create);