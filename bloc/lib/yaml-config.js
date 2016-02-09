var yaml = require('js-yaml');
var fs   = require('fs');

module.exports = {
    defaultConfigObj : defaultConfigObj,
    writeYaml : writeYaml,
    readYaml : readYaml
}

var defaultConfigObj = { 
  apiURL: 'https://strato-dev.blockapps.net',
  appName: 'newproj',
  appURL: 'http://google.com',
  developer: 'kjl',
  email: 'kieren1@gmail.com',
  repo: '',
  transferGasLimit: 21000, 
  contractGasLimit: 10000000
}

function writeYaml(filename, obj) {
  fs.writeFileSync(filename, yaml.safeDump(obj)); 
}

function readYaml(filename) {
  return yaml.safeLoad(fs.readFileSync(filename)); 
}
