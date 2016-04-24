define(function (require, exports, module) {

    var filter = function (vue) {

        /**
         * @see https://www.w3.org/Protocols/rfc822/#z28
         * @other 
         *     - pattern match: EEE, d+ MMM YYYY HH:mm:ss \+\d(4)
         */
        vue.filter('normalizeDate', function (v) {
            if (!v) {
                return;
            }

            var months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            // 'Wen, 22 Apr 2016 11:12:44 +0000
            // => [', 22 Apr 2016 11:12:44 +0000', '22 Apr 2016 11:12:44 ']
            var m = v.match(/,\s*(.+\s)/);

            var t = m ? m[1].split(' ').slice(0, 3).join(' ') : v;

            return t;
        });

        /**
         * 格式化时间
         *
         * @param {Date|number} date Date对象或者毫秒数
         * @param {string} fmt  格式化format
         * @other
         *      a(null, 'yyyy-MM-dd hh:mm:ss') "2016-04-22 23:37:53"
         *      a(null, 'yyy-M-dd hh:mm:ss')   "016-4-22 23:38:22"
         */
        vue.filter('formatDate', function (date, fmt) {
            if (!date) {
                return;
            }

            if (typeof date === 'number') {
                date = new Date(date);
            }

            var o = {
                'y+': date.getFullYear(),
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'h+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds()
            };

            for (var k in o) {
                if (o.hasOwnProperty(k)) {
                    fmt = fmt.replace(new RegExp('' + k), function (match) {

                        if (match.length == 1) {
                            return o[k];
                        }

                        return (new Array(match.length + 1).join('0') + o[k]).slice(-match.length)
                    });
                }
            }

            return fmt;
        });
    };

    module.exports = filter;
});
