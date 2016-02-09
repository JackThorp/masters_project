var through = require('through');

function runCode(path, runOptions, options) {
    var modulesRuntimeGlobal = (options && options.modulesRuntimeGlobal) || '$rmod';
    return modulesRuntimeGlobal + '.run(' + JSON.stringify(path) +
        (runOptions ? (',' + JSON.stringify(runOptions)) : '') + ');';
}

module.exports = function(path, runOptions, options) {

    var out = through();
    out.pause();

    out.queue(runCode(path, runOptions, options));
    out.end();

    return out;
};

module.exports.sync = runCode;