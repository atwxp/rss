/**
 * @file   util tool
 * @author wxp201013@163.com
 */

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

export function parseurl(url) {
    if (!url) {
        return {}
    }

    const params = url.split('://')

    const protocal = params[0] + ':'

    const host = params[1].split(/\/\/?/)[0]

    return {
        protocal,
        host
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

export function parseRSS(xml, feedUrl) {
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

    const urlObj = parseurl(feedUrl)

    let blogLink = rss.link

    if (/^\/\//.test(blogLink)) {
        blogLink = urlObj.protocal + blogLink
    }

    else if (blogLink === '/') {
        blogLink = urlObj.protocal + '//' + urlObj.host
    }

    blogLink += blogLink.slice(-1) !== '/' ? '/' : ''

    for (const item of xmlbody.getElementsByTagName('item')) {
        const info = getNodeContent(item, ['title', 'link', 'pubDate', 'description', 'dc:creator', 'content:encoded'], ns)

        let articleLink = info.link

        if (/^\/\//.test(articleLink)) {
            articleLink = urlObj.protocal + articleLink
        }

        else if (/^\//.test(articleLink)) {
             articleLink = blogLink + articleLink.slice(1)
        }

        rss.items.push({
            link:  articleLink,

            title: info.title,

            pubDate: info.pubDate,

            summary: info.description || info.content,

            creator: info.creator
        })
    }

    return rss
}

// https://validator.w3.org/feed/docs/atom.html
export function parseAtom(xml, feedUrl) {
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

    let blogLink = xmlrootInfo.id

    const urlObj = parseurl(feedUrl)

    if (/^\/\//.test(blogLink)) {
        blogLink = urlObj.protocal + blogLink
    }

    else if (blogLink === '/') {
        blogLink = urlObj.protocal + '//' + urlObj.host
    }

    blogLink += blogLink.slice(-1) !== '/' ? '/' : ''

    const rss = {
        items: [],

        link: blogLink,

        title: xmlrootInfo.title,

        author: author && (author.getElementsByTagName('name')[0] || {}).textContent
    }

    // 获取xmlroot下每个 entry 的信息
    Array.from(xmlroot.getElementsByTagName('entry')).forEach(entry => {
        const info = getNodeContent(entry, ['title', 'id', 'published', 'updated', 'summary', 'content'], ns)

        let author = entry.getElementsByTagName('author')[0]

        author = author && (author.getElementsByTagName('name')[0] || {}).textContent

        let articleLink = info.id

        if (/^\/\//.test(articleLink)) {
            articleLink = urlObj.protocal + articleLink
        }

        else if (/^\//.test(articleLink)) {
             articleLink = blogLink + articleLink.slice(1)
        }

        rss.items.push({
            link: articleLink,

            title: info.title,

            pubDate: info.update || info.published,

            summary: info.summary || info.content,

            creator: author || rss.author
        })
    })

    return rss
}

// https://validator.w3.org/feed/docs/
// 传入 feedUrl 因为有写 xml 的id 比如 <id>//litten.me/</id> 都是相对地址，和chrome extension协议不一样
export function parseFeed(xml, feedUrl) {
    const parser = new DOMParser()

    xml = parser.parseFromString(xml, 'application/xml')

    const atom = xml.getElementsByTagName('feed')[0]

    if (atom && /atom/i.test(atom.getAttribute('xmlns'))) {
        return parseAtom(xml, feedUrl)
    }
    else {
        return parseRSS(xml, feedUrl)
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
