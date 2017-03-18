export default function (Vue) {
    /**
     * @see https://www.w3.org/Protocols/rfc822/#z28
     * @other 
     *     - pattern match: EEE, d+ MMM YYYY HH:mm:ss \+\d(4)
     */
    Vue.filter('normalizeDate', function (v) {
        if (!v) {
            return
        }

        const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        // 'Wen, 22 Apr 2016 11:12:44 +0000
        // => [', 22 Apr 2016 11:12:44 +0000', '22 Apr 2016 11:12:44 ']
        const m = v.match(/,\s*(.+\s)/)

        // 2016-05-12T16:00:00.000Z, atom
        const m1 = v.match(/^(.+)T(.+)Z$/)

        let t = v

        if (m) {
            t = m[1].split(' ').slice(0, 3).join(' ')
        }
        else if (m1) {
            t = m1[1]
        }

        return t
    })

    /**
     * 格式化时间
     *
     * @param {Date|number} date Date对象或者毫秒数
     * @param {string} fmt  格式化format
     * @other
     *      a(null, 'yyyy-MM-dd hh:mm:ss') "2016-04-22 23:37:53"
     *      a(null, 'yyy-M-dd hh:mm:ss')   "016-4-22 23:38:22"
     */
    Vue.filter('formatDate', function (date, fmt) {
        if (!date) {
            return
        }

        if (typeof date === 'number') {
            date = new Date(date)
        }

        const o = {
            'y+': date.getFullYear(),

            'M+': date.getMonth() + 1,

            'd+': date.getDate(),

            'h+': date.getHours(),

            'm+': date.getMinutes(),

            's+': date.getSeconds()
        }

        for (const k of o) {
            fmt = fmt.replace(new RegExp('' + k), match => {
                if (match.length === 1) {
                    return o[k]
                }

                return (new Array(match.length + 1).join('0') + o[k]).slice(-match.length)
            })
        }

        return fmt
    })
}
