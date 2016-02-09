
function functionFilt(json) {
  return (json.type === "function");
}

function functionNameFilt(json,name) {
  return (json.type === "function" && json.name === name);
}

function abiToName(abi) {
  return abi.name;
}

function abiToInputs(abi) {
  return abi.inputs;
}

function abiToTypes(abi) {
  return abi.type;
}

var abiToListFuncNames = function(abi) {
  return abi.abi.filter(functionFilt).map(abiToName);
}

var abiFuncToListTypes = function(abi,funcName) {
  return abi.abi.filter(function (t) { return functionNameFilt(t,funcName); })
              .map(abiToInputs)[0]
              .map(abiToTypes);
}

var abiToFuncTypeObj = function(abi) {
  return (abiToListFuncNames(abi)).reduce(function (o,v,t) { 
     o[v] = abiFuncToListTypes(abi,v); 
     return o; 
    }, 
 {});
}

var payloadForSolFunc = function(abi,funcName,listArgs) {

}

module.exports = (function () {
  return { 
    abiToListFuncNames : abiToListFuncNames,
    abiFuncToListTypes : abiFuncToListTypes,
    abiToFuncTypeObj   : abiToFuncTypeObj,
    payloadForSolcFunc : payloadForSolFunc
  };
})();
