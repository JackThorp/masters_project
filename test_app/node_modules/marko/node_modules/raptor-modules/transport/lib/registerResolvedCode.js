var through = require('through');

function registerResolvedCode(target, from, resolved, options) {
    var modulesRuntimeGlobal = (options && options.modulesRuntimeGlobal) || '$rmod';

    var out = through();
    out.pause();

    out.queue(modulesRuntimeGlobal + '.resolved(' + JSON.stringify(target) + ', ' +
        JSON.stringify(from) + ', ' +
        JSON.stringify(resolved) + ');');

    out.end();

    return out;
}

module.exports = registerResolvedCode;