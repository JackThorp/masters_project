var through = require('through');

function registerDependencyCode(logicalParentPath, childName, childVersion, overrideName, options) {
    var modulesRuntimeGlobal = (options && options.modulesRuntimeGlobal) || '$rmod';

    var out = through();
    out.pause();

    out.queue(modulesRuntimeGlobal + '.dep(' + JSON.stringify(logicalParentPath) + ', ' +
        JSON.stringify(overrideName || childName) + ', ' +
        JSON.stringify(childVersion));

    if (overrideName) {
        out.queue(', ' + JSON.stringify(childName));
    }

    out.queue(');');

    out.end();

    return out;
}

module.exports = registerDependencyCode;