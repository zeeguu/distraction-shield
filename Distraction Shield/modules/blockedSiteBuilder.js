define(['urlFormatter', 'BlockedSite'], function BlockedSiteBuilder(urlFormatter, BlockedSite) {

    // this requires a callback since the getUrlFromServer is asynchronous
    createNewBlockedSite = function (newUrl, callback) {
        console.log('newUrl: ' + newUrl); //todo remove
        urlFormatter.getUrlFromServer(newUrl, function (url, title) {
            console.log('url: ' + url); //todo remove
            // console.log('BlockedSite: ' + JSON.stringify(BlockedSite));
            var bs = new BlockedSite.BlockedSite(url, title);
            console.log('bs: ' + bs); //todo remove
            console.log(bs.getUrl());
            callback(bs);
        });
    };


    return {
        createNewBlockedSite: createNewBlockedSite
    }

});

//var blockedSiteBuilder = new BlockedSiteBuilder();