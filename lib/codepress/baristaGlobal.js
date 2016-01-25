var util = require("util");

//define the barista global
module.exports = {
    isArray: util.isArray,
    isDate: util.isDate,
    isDefined: function (obj) { return !util.isUndefined(obj); },
    isFunction: util.isFunction,
    isNumber: util.isNumber,
    isObject: util.isObject,
    isString: util.isString,
    isUndefined: util.isUndefined,
    str2buf: function (str) {
        var buf = new Buffer(str.length);
        for (var i = 0; i <= str.length; i++) {
            buf[i] = str.charCodeAt(i);
        }
        return buf;
    }
};