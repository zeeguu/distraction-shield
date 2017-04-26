define(['urlFormatter', 'BlockedSite'], function BlockedSiteBuilder(urlFormatter, BlockedSite) {

    // this requires a callback since the getUrlFromServer is asynchronous
    createNewBlockedSite = function (newUrl, callback) {
        urlFormatter.getUrlFromServer(newUrl, function (url, title) {
            var bs = BlockedSite.BlockedSite(url, title);
            callback(bs);
        });
    };


    return {
        createNewBlockedSite: createNewBlockedSite
    }

});

//var blockedSiteBuilder = new BlockedSiteBuilder();