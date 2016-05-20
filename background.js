// https://css-tricks.com/colorpeek-part-2-building-first-chrome-extension/
chrome.browserAction.onClicked.addListener(function (tab) {
    var url = chrome.extension.getURL('index.html');

    chrome.tabs.query({}, function (tabs) {
        var openTab = tabs.filter(function (t) {
            return t.url && t.url.indexOf(url) > -1;
            // return t.url === url;
        });

        if (openTab.length) {
            chrome.tabs.update(openTab[0].id, {
                selected: true
            });
        }
        else {
            chrome.tabs.create({
                url: url,
                selected: true
            });
        }
    });
});
