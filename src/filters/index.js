define(function (require, exports, module) {

    var filter = function (vue) {
        /**
         * 
         * @see https://www.w3.org/Protocols/rfc822/#z28
         * @other 
         *     - pattern match: EEE, d+ MMM YYYY HH:mm:ss \+\d(4)
         */
        vue.filter('normalizeDate', function (v) {
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            var m = v.match(/,\s+([\w\s:\+]+)/g);

            m = m && m[0] || '';

            m = m.split(' ');

            m.shift();

            return Date.parse([m[2], months.indexOf(m[1]) + 1, m[0]].join('-'));
        });

        vue.filter('formatDate', function (date, fmt) {

            date = date || new Date();

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
