function removeDashes(str) {
    return str.replace(/-([a-z])/g, function (match, lower) {
        return lower.toUpperCase();
    });
}

module.exports = function invokeHandlers(config, handlers, options) {
    var path;

    if (options != null) {
        if (typeof options === 'string') {
            path = options;
        } else {
            path = options.path;
        }
    }

    function error(message, cause) {
        if (cause) {
            if (cause.__propertyHandlers) {
                throw cause;
            }

            message += '. Cause: ' + (cause.stack || cause);
        }

        if (path) {
            message = 'Error while handling properties for ' + path + ': ' + message;
        }

        var e = new Error(message);
        e.__propertyHandlers = true;
        throw e;
    }

    if (!config) {
        error('"config" argument is required');
    }

    if (typeof config !== 'object') {
        error('object expected');
    }

    for (var k in config) {
        if (config.hasOwnProperty(k)) {
            var value = config[k];
            var keyNoDashes = removeDashes(k);
            var handler = handlers[keyNoDashes];
            var isDefaultHandler = false;

            if (!handler) {
                handler = handlers['*'];
                isDefaultHandler = true;
            }

            if (!handler) {
                error('Invalid option of "' + keyNoDashes + '". Allowed: ' + Object.keys(handlers).join(', '));
            }

            try {
                if (isDefaultHandler) {
                    if (handler.call(handlers, k, value) === false) {
                        error('Invalid option: ' + k);
                    }
                } else {
                    handler.call(handlers, value);
                }
            } catch(e) {
                error('Error while applying option of "' + k + '"', e);
            }
        }
    }

    if (handlers._end) {
        try {
            handlers._end();
        }
        catch(e) {
            error('Error after applying properties', e);
        }
    }
};