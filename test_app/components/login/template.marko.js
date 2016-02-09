function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      ___keyModal_template = __helpers.l(require.resolve("../keyModal/template"));

  return function render(data, out) {
    ___keyModal_template.render({"apiURL": data.apiURL}, out);

    out.w('<button onclick="$(&#39;#passwordModal&#39;).modal(&#39;show&#39;)">Log In!</button>');
  };
}
(module.exports = require("marko").c(__filename)).c(create);