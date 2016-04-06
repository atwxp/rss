var googleUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&context=result&num=8';

var rssurl = [
    'http://news.163.com/special/00011K6L/rss_newstop.xml',
    'http://pansci.asia/feed'
];

var parse = function (context, data) {
    var container = document.querySelector(context);

    // creating list of elements
    var mainList = document.createElement('ul');
    // also creating its childs (subitems)
    var entries = data.feed.entries;

    for (var i = 0; i < entries.length; i++) {
        var link = document.createElement('a');
        link.setAttribute('href', entries[i].link);
        link.setAttribute('target','_blank');

        var text = document.createTextNode(entries[i].title);
        link.appendChild(text);

        var desc = document.createElement('p');
        desc.appendChild(document.createTextNode(entries[i].contentSnippet));

        // add link to list item
        var listItem = document.createElement('li');
        listItem.appendChild(link);

        // add description to list item
        listItem.appendChild(desc);

        // adding list item to main list
        mainList.appendChild(listItem);
    }

    container.appendChild(mainList);
};

var sendXhr = function (url, callback) {
    var xhr = new XMLHttpRequest;

    xhr.onload = function () {
        if (xhr.status == 200) {
            var res = JSON.parse(xhr.response);
    
            if (res.responseStatus == 200) {
                parse('#result', res.responseData);
            }
        }
    };

    xhr.open('GET', url);

    xhr.send(null);
};

document.body.onclick = function () {
    sendXhr(googleUrl + '&q=' + encodeURIComponent(rssurl[0]));
}
