define(function (require, exports, module) {

    var util = require('./index');

    var storage = window.localStorage;

    // feature detect
    var support = !!(storage && storage.setItem);

    // ios 无痕浏览, localStorage可以读, 但是不可以写&删除
    var available = (function () {
        try {
            storage.setItem('_t', ' ');
        }
        catch (e) {
            return false;
        }

        return true;
    })();

    var parse = function (str) {
        try {
            return JSON.parse(str);
        }
        catch (e) {
            return str;
        }
    };

    var set = function (key, value) {
        if (!support || !available) {
            return;
        }

        if (!/object|array|string/.test(util.type(value))) {
            throw new Error('`' + value + '` is not the valid value, only support String or Object or Array');
            return;
        }

        try {
            storage.setItem(key, JSON.stringify(value));
        }

        catch (e) {
            console.log(e);
        }
    };

    var get = function (key) {
        if (!support) {
            return;
        }

        // null || string
        var v = storage.getItem(key);

        return parse(v);
    };

    var remove = function (key) {

        if (!support || !available) {
            return;
        }

        storage.removeItem(key);
    };

    var clear = function () {
        if (!support || !available) {
            return;
        }

        storage.clear();
    };

    var getAll = function () {
        var ret = {};

        for (var i = 0, len = storage.length; i < len; i++) {
            var k = storage[i];

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
