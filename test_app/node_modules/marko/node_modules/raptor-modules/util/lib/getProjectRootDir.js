var appRootDir = require('app-root-dir');

module.exports = function getProjectRootDir() {
    return appRootDir.get();
};
