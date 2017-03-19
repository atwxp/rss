/**
 * @file   util tool
 * @author wxp201013@163.com
 */
import Vue from 'vue'

export function gid() {
    return 'xxxxxxxx'.replace(/x/g, function (v) {
        return (Math.random() * 16 | 0).toString(16)
    })
}

export function parse(str) {
    try {
        return JSON.parse(str)
    }
    catch (e) {
        return str
    }
}

// http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
export function checkUrl(url) {
    return /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(url)
}

export function getNodeContent(parent, nodes, namespace) {
    nodes = nodes instanceof Array ? nodes : [nodes]

    const ret = {};

    for (let node of nodes) {
        node = node.split(':')

        const ns = namespace[node.length === 1 ? 'xmlns' : node[0]]

        node = node[node.length === 1 ? 0 : 1]

        const n = parent.getElementsByTagNameNS(ns, node)[0]

        ret[node] = n && n.textContent
    }

    return ret
}

export function parseOPML(opml) {
    const doc = new DOMParser().parseFromString(opml, 'text/xml')

    const opmlroot = doc.getElementsByTagName('opml')[0]

    const outline = opmlroot && opmlroot.getElementsByTagName('outline')

    const ret = []

    if (outline && outline.length) {
        for (const otl of outline) {

            if (!/rss/.test(otl.getAttribute('type'))) {
                continue
            }

            ret.push({
                url: otl.getAttribute('xmlUrl'),

                link: otl.getAttribute('htmlUrl'),

                title: otl.getAttribute('title')
            })
        }
    }

    return ret
}

export function parseRSS(xml) {
    if (!(xml instanceof XMLDocument)) {
        const parser = new DOMParser()

        xml = parser.parseFromString(xml, 'text/xml')
    }

    const xmlbody = xml.getElementsByTagName('channel')[0]
    if (!xmlbody) {
        return
    }

    // xmlns:atom="http://www.w3.org/2005/Atom"
    // attr.name: 'xmlns:atom'
    // attr.localName: atom
    const xmlroot = xml.getElementsByTagName('rss')[0]
    const ns = {xmlns: null}
    Array.from(xmlroot.attributes).forEach(attr => {
        if (/^xmlns:?(\w+)?/.test(attr.name)) {
            ns[attr.localName] = attr.value
        }
    })

    const rss = Object.assign({items: []}, getNodeContent(xmlbody, ['title', 'link'], ns))
    for (const item of xmlbody.getElementsByTagName('item')) {
        const info = getNodeContent(item, ['title', 'link', 'pubDate', 'description', 'dc:creator', 'content:encoded'], ns)

        rss.items.push({
            link: info.link,

            title: info.title,

            pubDate: info.pubDate,

            summary: info.description,

            article: info.content,

            creator: info.creator
        })
    }

    return rss
}

// https://validator.w3.org/feed/docs/atom.html
export function parseAtom(xml) {
    if (!(xml instanceof XMLDocument)) {
        const parser = new DOMParser()
        xml = parser.parseFromString(xml, 'text/xml')
    }

    const xmlroot = xml.getElementsByTagName('feed')[0]
    if (!xmlroot) {
        return
    }

    // xmlns:atom="http://www.w3.org/2005/Atom"
    // attr.name: 'xmlns:atom'
    // attr.localName: atom
    const ns = {xmlns: null}
    Array.from(xmlroot.attributes).forEach(attr => {
        if (/^xmlns:?(\w+)?/.test(attr.name)) {
            ns[attr.localName] = attr.value
        }
    })

    // 获取xmlroot本身的信息
    const author = xmlroot.getElementsByTagName('author')[0]
    const xmlrootInfo = getNodeContent(xmlroot, ['id', 'title'], ns)
    const rss = {
        items: [],
        link: xmlrootInfo.id,
        title: xmlrootInfo.title,
        author: author && (author.getElementsByTagName('name')[0] || {}).textContent
    }

    // 获取xmlroot下每个 entry 的信息
    Array.from(xmlroot.getElementsByTagName('entry')).forEach(entry => {
        const info = getNodeContent(entry, ['title', 'id', 'published', 'updated', 'summary', 'content'], ns)

        let author = entry.getElementsByTagName('author')[0]
        author = author && (author.getElementsByTagName('name')[0] || {}).textContent

        rss.items.push({
            link: info.id,

            title: info.title,

            pubDate: info.update || info.published,

            summary: info.summary,

            article: info.content,

            creator: author || rss.author
        })
    })

    return rss
}

// https://validator.w3.org/feed/docs/
export function parseFeed(xml) {
    const parser = new DOMParser()

    xml = parser.parseFromString(xml, 'application/xml')

    const atom = xml.getElementsByTagName('feed')[0]

    if (atom && /atom/i.test(atom.getAttribute('xmlns'))) {
        return parseAtom(xml)
    }
    else {
        return parseRSS(xml)
    }
}

export function encodeHTML(str) {
    const code = {
        '&': '&amp;',

        '>': '&gt;',

        '<': '&lt;',

        '"': '&quot;',

        "'": '&#x27;'
    }

    return str.replace(/[&><"']/g, m => code[m])
}

export function fetchFeed(url) {
    return new Promise((resolve, reject) => {
        Vue.http.get(url).then(response => {
            if (!response.ok) {
                reject(response.statusText)
            }

            if (typeof response.body === 'string') {
                const rss = parseFeed(response.body)

                rss ? resolve(rss) : reject()
            }
            else {
                const reader = new FileReader()

                reader.onload = function (e) {
                    const rss = parseFeed(e.target.result)

                    rss ? resolve(rss) : reject()
                }

                reader.onerror = function () {
                    reject()
                }

                reader.readAsText(response.body)
            }
        }, err => {
            reject(err)
        })
    })
}
