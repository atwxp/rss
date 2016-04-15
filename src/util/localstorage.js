define(function (require, exports, module) {
    var localStorage = window.localStorage;

    var support = !!(localStorage && localStorage.setItem);

    var parse = function (str) {
        try {
            return JSON.parse(str);
        }
        catch (e) {
            return str;
        }
    };

    var set = function (key, value) {
        if (!support) {
            return;
        }

        try {
            localStorage.setItem(key, JSON.stringify(value));
        }

        catch (e) {
            console.log(e);
        }
    };

    var get = function (key) {
        // null/string
        var v = localStorage.getItem(key);

        return parse(v);
    };

    var remove = function (key) {
        localStorage.removeItem(key);
    };

    var clear = function () {
        localStorage.clear();
    };

    var getAll = function () {
        var ret = {};

        for (var i = 0, len = localStorage.length; i < len; i++) {
            var k = localStorage[i];

            ret[k] = getItem(k);
        }

        return ret;
    };

    module.exports = {
        set: set,
        get: get,
        remove: remove,
        clear: clear,
        getAll: getAll
    };

});
