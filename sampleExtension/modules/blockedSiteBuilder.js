function BlockedSiteBuilder() {
    var self = this;

    this.createNewBlockedSite = function (newUrl) {
        urlFormatter.getUrlFromServer(newUrl, function (url, title) {
            newItem = new BlockedSite(url, title);
            return newItem;
        });
    };
}

var blockedSiteBuilder = new BlockedSiteBuilder();