var through = require('through');

function registerRemapCode(from, to, options) {
    var modulesRuntimeGlobal = (options && options.modulesRuntimeGlobal) || '$rmod';

    var out = through();
    out.pause();

    out.queue(modulesRuntimeGlobal + '.remap(' + JSON.stringify(from) + ', ' +
        JSON.stringify(to) + ');');
    out.end();
    return out;
}

module.exports = registerRemapCode;