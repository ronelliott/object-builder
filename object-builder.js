'use strict';

const is = require('is'),
      objectPath = require('object-path');

module.exports = function(fields) {
    var args = arguments;
    return (is.array(fields) ? fields : Object.keys(fields))
        .reduce(function(obj, field) {
            var child, value;

            if (is.object(fields)) {
                field = fields[field];
            }

            if (field.indexOf('.') !== -1) {
                field = field.split('.');
                child = field.slice(1).join('.');
                field = field[0];
            }

            for (var i = 1; i < args.length; i++) {
                var resolver = args[i];

                if (is.object(resolver) && field in resolver) {
                    value = resolver[field];
                    i = args.length;
                }

                if (is.function(resolver)) {
                    var val = resolver(field);

                    if (!(is.undefined(val))) {
                        value = val;
                        i = args.length;
                    }
                }
            }

            if (child) {
                value = objectPath.get(value, child);
            }

            obj[field] = value;
            return obj;
        }, {});
};
