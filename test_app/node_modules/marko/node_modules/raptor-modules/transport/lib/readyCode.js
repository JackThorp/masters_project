var through = require('through');

function _buildCode(options) {
    var modulesRuntimeGlobal = (options && options.modulesRuntimeGlobal) || '$rmod';
    return modulesRuntimeGlobal + '.ready();';
}

function readyCode(options) {
    var stream = through();
    stream.pause();
    stream.queue(_buildCode(options));
    stream.end();
    return stream;
}

module.exports = exports = readyCode;

exports.sync = function(logicalPath, code, options) {
    return _buildCode(options);
};