var through = require('through');

function registerMainCode(path, main, options) {
    var modulesRuntimeGlobal = (options && options.modulesRuntimeGlobal) || '$rmod';

    var out = through();
    out.pause();

    out.queue(modulesRuntimeGlobal + '.main(' + JSON.stringify(path) + ', ' +
        JSON.stringify(main) + ');');
    out.end();
    return out;
}

module.exports = registerMainCode;