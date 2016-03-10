"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var factory = function factory(Pudding) {
  // Inherit from Pudding. The dependency on Babel sucks, but it's
  // the easiest way to extend a Babel-based class. Note that the
  // resulting .js file does not have a dependency on Babel.

  var Goop = (function (_Pudding) {
    _inherits(Goop, _Pudding);

    function Goop() {
      _classCallCheck(this, Goop);

      _get(Object.getPrototypeOf(Goop.prototype), "constructor", this).apply(this, arguments);
    }

    return Goop;
  })(Pudding);

  ;

  // Set up specific data for this class.
  Goop.abi = [{ "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "organisations", "outputs": [{ "name": "name", "type": "bytes32" }, { "name": "numMembers", "type": "uint256" }], "type": "function" }, { "constant": false, "inputs": [], "name": "getFive", "outputs": [{ "name": "num", "type": "uint256" }], "type": "function" }, { "constant": false, "inputs": [{ "name": "name", "type": "bytes32" }], "name": "newOrganisation", "outputs": [{ "name": "orgID", "type": "uint256" }], "type": "function" }, { "constant": false, "inputs": [{ "name": "orgID", "type": "uint256" }, { "name": "name", "type": "bytes32" }], "name": "join", "outputs": [], "type": "function" }];
  Goop.binary = "606060405260db8060106000396000f3606060405260e060020a6000350463246f8c44811460385780633ef7df5014605757806345be284c1460645780639a478b4914607d575b005b6001602081905260043560009081526040902090810154905460ce9182565b60055b6060908152602090f35b600080546001818101835591819052602091909152605a565b600435600090815260016020818152604080842080840180548086019091558552600201909152909120805473ffffffffffffffffffffffffffffffffffffffff1916331781556024359101556036565b6060918252608052604090f3";

  if ("0xb688651aa955ea0d3df7c179e42934680ede5958" != "") {
    Goop.address = "0xb688651aa955ea0d3df7c179e42934680ede5958";

    // Backward compatibility; Deprecated.
    Goop.deployed_address = "0xb688651aa955ea0d3df7c179e42934680ede5958";
  }

  Goop.generated_with = "1.0.3";
  Goop.contract_name = "Goop";

  return Goop;
};

// Nicety for Node.
factory.load = factory;

if (typeof module != "undefined") {
  module.exports = factory;
} else {
  // There will only be one version of Pudding in the browser,
  // and we can use that.
  window.Goop = factory;
}