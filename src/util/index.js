define(function (require, exports, module) {

    // http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
    var checkUrl = function (url) {
        return /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(url);
    };

    var parseRSSMeta = function (xml) {
        var parser = new DOMParser();

        xml = parser.parseFromString(xml, 'text/xml');

        var channel = xml.getElementsByTagName('channel');

        if (!channel || !channel[0]) {
            return false;
        }

        channel = channel[0];

        var title = channel.getElementsByTagName('title');
        title = title && title[0]['textContent'];

        var url = channel.getElementsByTagName('link');
        if (url) {
            for (var i = 0, len = url.length; i < len; i++) {
                if (url[i].tagName.toLowerCase() === 'link') {
                    break;
                }
            }
            url = url[i]['textContent'];
        }

        var desc = channel.getElementsByTagName('description');
        desc = desc && desc[0]['textContent'];

        return {
            title: title,
            url: url,
            desc: desc
        }
    };

    var extend = function (source, target) {
        for (var i in target) {
            if (target.hasOwnProperty(i)) {
                source[i] = target[i];
            }
        }

        return source;
    };

    module.exports = {
        checkUrl: checkUrl,
        parseRSSMeta: parseRSSMeta,
        extend: extend
    };

});
