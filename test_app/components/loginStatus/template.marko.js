function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      ___login_template = __helpers.l(require.resolve("../login/template"));

  return function render(data, out) {
    out.w('<div id="loginDiv" style="border: 1px solid black; padding: 10px; margin-bottom: 1em;"><p> Login Status </p><ul class="nav nav-pills">');

    if (notEmpty(data.globalPassword)) {
      out.w('<li class="active"><a href="#"> <font color="black"> Logged in! </font> </a></li>');
    }
    else {
      out.w('<li> <a href="#"> Possibly not logged in! </a> </li>');
    }

    out.w('</ul>');

    ___login_template.render({"apiURL": data.apiURL}, out);

    out.w('</div>');
  };
}
(module.exports = require("marko").c(__filename)).c(create);