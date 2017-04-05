var console = chrome.extension.getBackgroundPage().console;

function BlockedSiteBuilder() {
    var self = this;

    // this requires a callback since the getUrlFromServer is asynchronous
    this.createNewBlockedSite = function(newUrl, callback) {
        getUrl = urlFormatter.getUrlFromServer(newUrl, function(url, title) {
            console.log(callback);
            var bs = new BlockedSite(url, title);
            callback(bs);
        });
    };
}

var blockedSiteBuilder = new BlockedSiteBuilder();