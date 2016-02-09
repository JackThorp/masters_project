function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      ___navTemplate_template = __helpers.l(require.resolve("../navTemplate/template"));

  return function render(data, out) {
    out.w('<head><title> ' +
      escapeXml(data.title) +
      ' </title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta http-equiv="Content-Language" content="en"><script src="http://code.jquery.com/jquery-1.10.2.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.js"></script><link rel="stylesheet" href="/css/bootstrap.min.css"><link rel="stylesheet" href="/css/styles.css"></head><div class="container main__container">');

    ___navTemplate_template.render({}, out);

    out.w('</div>');
  };
}
(module.exports = require("marko").c(__filename)).c(create);