function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne;

  return function render(data, out) {
    out.w('<nav class="navbar navbar-inverse navbar-fixed-top"><div class="container-fluid"><div class="navbar-header"><button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"><span class="sr-only"> Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><ul class="nav navbar-nav"><li><a class="nav__logo--link" href="http://portal.blockapps.net/markdown"><img class=" nav__logo" src="http://portal.blockapps.net/static/img/ic_logo.png"></a></li></ul></div></div></nav>');
  };
}
(module.exports = require("marko").c(__filename)).c(create);