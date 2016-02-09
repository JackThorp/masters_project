var through = require('through');

function defineCode(path, code, options) {
    var isObject = false;
    var additionalVars = null;
    var globals = null;
    var wait = true;

    if (options) {
        isObject = options.object === true;
        additionalVars = options.additionalVars;
        globals = options.globals;
        wait = options.wait !== false;
    }

    if (code == null) {
        throw new Error('"code" argument is required');
    }

    var modulesRuntimeGlobal = (options && options.modulesRuntimeGlobal) || '$rmod';

    var out = [];
    out.push(modulesRuntimeGlobal + '.def(');
    out.push(JSON.stringify(path));

    if (isObject) {
        out.push(', ');
    } else {
        out.push(', function(require, exports, module, __filename, __dirname) { ');
        if (additionalVars && additionalVars.length) {
            out.push('var ' + additionalVars.join(', ') + '; ');
        }
    }


    out.push(code);

    if (!isObject) {
        out.push('\n}'); // End the function wrapper
    }

    if (globals || (wait === false)) {

        var defOptions = {};
        if (globals) {
            if (!Array.isArray(globals)) {
                globals = [globals];
            }

            defOptions.globals = globals;
        }

        if (wait === false) {
            defOptions.wait = false;
        }

        out.push(',' + JSON.stringify(defOptions));
    }


    out.push(');'); // End the function call
    return out.join('');
}

module.exports = function(path, code, options) {
    var out = through();
    out.pause();

    if (code.pipe) {
        var stream = code;
        code = '';
        stream.pipe(through(
            function write(data) {
                code += data;
            },
            function end() {
                out.queue(defineCode(path, code, options));
                out.end();
            }));
    } else {
        out.queue(defineCode(path, code, options));
        out.end();
    }

    return out;
};

module.exports.sync = function(path, code, options) {
    return defineCode(path, code, options);
};
