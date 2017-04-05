var console = chrome.extension.getBackgroundPage().console;

function BlockedSiteBuilder() {
    var self = this;

    // this requires a callback since the getUrlFromServer is asynchronous
    this.createNewBlockedSite = function (newUrl, callback) {
        console.log("success");
        getUrl = urlFormatter.getUrlFromServer(newUrl, function (url, title) {
            var bs = new BlockedSite(url, title);
            console.log(title);
            callback(bs);
        });
    };
}

var blockedSiteBuilder = new BlockedSiteBuilder();