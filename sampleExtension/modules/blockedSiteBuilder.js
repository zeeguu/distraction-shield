function BlockedSiteBuilder() {
    var self = this;

    // this requires a callback since the getUrlFromServer is asynchronous
    this.createNewBlockedSite = function(newUrl, callback) {
        urlFormatter.getUrlFromServer(newUrl, function(url, title) {
            var bs = new BlockedSite(url, title);
            callback(bs);
        });
    };
}

var blockedSiteBuilder = new BlockedSiteBuilder();