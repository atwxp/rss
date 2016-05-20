define(function (require, exports, module) {

    var type = function (o) {
        return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
    };

    var gid = function () {
        return 'xxxx'.replace(/x/g, function (v) {
            return (Math.random() * 16 | 0).toString(16);
        });
    };

    var forEach = function (obj, method) {
        if (type(obj) === 'array') {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (method.call(this, obj[i], i) === false) {
                    break;
                }
            }
            return;
        }

        for (var key in obj) {
            if (obj.hasOwnProperty(key) && method.call(this, obj[key], key) ===  false) {
                return;
            }
        }
    };

    var transform = function (obj, method) {
        var target = new obj.constructor();

        forEach(obj, function (val, key) {
            method(target, val, key);
        });

        return target;
    };

    var map = function (obj, method) {
        return transform(obj, function (target, v, k) {
            target[k] = method ? method(v, k) : v;
        });
    };

    var filter = function (obj, method) {
        return transform(obj, function (target, v, k) {
            if (method(v, k)) {
                target[k] = v;
            }
        });
    };

    var clone = map;

    var extend = function (target, source, alone) {
        target = alone ? clone(target) : target;

        forEach(source, function (v, k) {
            target[k] = v;
        });

        return target;
    };

    // http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
    var checkUrl = function (url) {
        return /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(url);
    };

    var getNodeContent = function (parent, nodes, namespace) {
        nodes = nodes instanceof Array ? nodes : [nodes];

        var ret = {};

        forEach(nodes, function (node) {
            node = node.split(':');

            var ns = namespace[node.length === 1 ? 'xmlns' : node[0]];

            node = node[node.length === 1 ? 0 : 1];

            var n = parent.getElementsByTagNameNS(ns, node);

            ret[node] = n && n[0] && n[0].textContent;
        });

        return ret;
    };

    var parseOPML = function (opml) {
        var parser = new DOMParser();

        opml = parser.parseFromString(opml, 'text/xml');

        var opmlTag = opml.getElementsByTagName('opml')

        if (!opmlTag || !opmlTag.length) {
            return false;
        }

        opmlTag = opmlTag[0];

        var outline = opmlTag.getElementsByTagName('outline');

        if (!outline || !outline.length) {
            return false;
        }

        var ret = [];

        forEach(outline, function (otl) {
            var type = otl.getAttribute('type') || '';

            if (!/rss/.test(type)) {
                return;
            }

            ret.push({
                xmlUrl: otl.getAttribute('xmlUrl'),
                htmlUrl: otl.getAttribute('htmlUrl'),
                title: otl.getAttribute('title')
            });
        });

        return ret;
    };

    var parseRSS = function (xml) {
        if (!(xml instanceof XMLDocument)) {
            var parser = new DOMParser();
            xml = parser.parseFromString(xml, 'text/xml');
        }

        var channel = xml.getElementsByTagName('channel');

        if (!channel || !channel.length) {
            return;
        }

        channel = channel[0];

        var rss = xml.getElementsByTagName('rss');
        rss = rss && rss[0];

        var ns = {xmlns: null};
        forEach(rss.attributes, function (v, k) {
            if (/^xmlns:?(\w+)?/.test(v.name)) {
                ns[v.localName] = v.value;
            }
        });

        var rss = extend({items: []}, getNodeContent(channel, ['title', 'link'], ns));

        var items = channel.getElementsByTagName('item');
        forEach(items, function (item) {
            rss.items.push(
                getNodeContent(
                    item,
                    ['title', 'link', 'pubDate', 'description', 'dc:creator', 'content:encoded'],
                    ns
                )
            );
        });

        return rss;
    };

    var parseAtom = function (xml) {
        if (!(xml instanceof XMLDocument)) {
            var parser = new DOMParser();
            xml = parser.parseFromString(xml, 'text/xml');
        }

        var feed = xml.getElementsByTagName('feed');
        if (!feed || !feed.length) {
            return;
        }
        feed = feed[0];

        var ns = {xmlns: null};
        forEach(feed.attributes, function (v, k) {
            if (/^xmlns:?(\w+)?/.test(v.name)) {
                ns[v.localName] = v.value;
            }
        });

        var rss = extend({items: [], link: ''}, getNodeContent(feed, 'title', ns));
        forEach(feed.getElementsByTagNameNS(ns.xmlns, 'link') || [], function (val) {
            var u = val.getAttribute('href');
            rss.link = u;
            return !(/atom.xml/i.test(u));
        });

        var entry = feed.getElementsByTagName('entry');
        forEach(entry, function (et) {
            var info = getNodeContent(et, ['title', 'published', 'content', 'summary'], ns);

            // link
            var link = et.getElementsByTagName('link');
            link = link && link[0] && link[0].getAttribute('href');

            // author
            var author = et.getElementsByTagName('author');
            author = author && author[0];
            var creator = author && author.getElementsByTagName('name');
            creator = creator && creator[0] && creator[0].textContent;

            rss.items.push(extend(info, {
                creator: creator,
                link: link,
                pubDate: info.published,
                encoded: info.content,
                description: info.summary
            }));
        });

        return rss;
    };

    var parseFeed = function (xml) {
        var parser = new DOMParser();

        xml = parser.parseFromString(xml, 'text/xml');

        var atom = xml.getElementsByTagName('feed');

        if (atom && atom[0] && /atom/i.test(atom[0].getAttribute('xmlns'))) {
            return parseAtom(xml);
        }
        else {
            return parseRSS(xml);
        }
    };

    var encodeHTML = function (str) {
        var code = {
            '&': '&amp;',
            '>': '&gt;',
            '<': '&lt;',
            '"': '&quot;',
            "'": '&#x27;'
        };

        return str.replace(/[&><"']/g, function (m) {
            return code[m];
        });
    };

    module.exports = {
        encodeHTML: encodeHTML,
        parseOPML: parseOPML,
        parseRSS: parseRSS,
        parseAtom: parseAtom,
        parseFeed: parseFeed,
        checkUrl: checkUrl,
        forEach: forEach,
        extend: extend,
        filter: filter,
        clone: clone,
        type: type,
        gid: gid,
        map: map
    };

});
