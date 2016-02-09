function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      forEach = __helpers.f,
      forEachProp = __helpers.fp,
      escapeXmlAttr = __helpers.xa,
      escapeXml = __helpers.x,
      attr = __helpers.a;

  return function render(data, out) {
    out.w('<div "class="container&quot;" id="functionsContainer"> ');

    forEach(data.contractMeta, function(contract) {
      out.w('<div>');

      forEachProp(contract.symTab, function(symbol,symbolObj) {
        out.w('<div>');

        if (symbolObj.jsType == 'Function') {
          out.w('<div><div id="' +
            escapeXmlAttr(symbol) +
            'Div"><button style="background-color: #223765; color: white" class="btn col-sm-12" onclick="callFunc(&#39;' +
            escapeXmlAttr(symbol) +
            '&#39;)">' +
            escapeXml(symbol) +
            '</button> ');

          forEach(symbolObj.functionArgs, function(argName) {
            out.w('<input class="form-control col-sm-12" type="text"' +
              attr("name", argName) +
              attr("placeholder", argName) +
              ' id="' +
              escapeXmlAttr(symbol) +
              escapeXmlAttr(argName) +
              '">');
          });

          out.w(' <input class="form-control col-sm-12" type="value" name="' +
            escapeXmlAttr(symbol) +
            'ValueField" placeholder="send value in Ether" id="' +
            escapeXmlAttr(symbol) +
            'ValueField"> </div></div>');
        }

        out.w('</div>');
      });

      out.w('<textarea class="form-control" id="afterTXarea" readonly="true" rows="14"></textarea> </div>');
    });

    out.w('</div>');
  };
}
(module.exports = require("marko").c(__filename)).c(create);