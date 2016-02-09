function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      forEach = __helpers.f,
      escapeXml = __helpers.x;

  return function render(data, out) {
    forEach(data.contractMeta, function(cs) {
      out.w('<div style="border: 1px solid black; padding: 10px; margin-bottom: 1em;"><p>' +
        escapeXml(cs.name) +
        ' Status </p><ul class="nav nav-pills"><li class="active"><a href="#">Compiled</a> </li>');

      if (notEmpty(cs.address)) {
        out.w('<li class="active"><a href="#">Uploaded with address: <span class="upload-address">' +
          escapeXml(cs.address) +
          '</span></a></li>');
      }
      else {
        out.w('<li> <a href="#"> Not yet uploaded! Upload with <b> bloc upload ' +
          escapeXml(cs.name) +
          ' </b> </a> </li>');
      }

      out.w('</ul></div>');
    });
  };
}
(module.exports = require("marko").c(__filename)).c(create);