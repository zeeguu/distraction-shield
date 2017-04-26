
define(['background','storage'], function Synchronizer(background, storage) {

    var syncBlacklist = function(blockedSiteList) {
        storage.setBlacklist(blockedSiteList);
        background.setLocalBlacklist(blockedSiteList);
    };

    var syncSettings = function(settings) {
        storage.setSettings(settings);
        background.setLocalSettings(settings);
    };

    var syncDateList = function(dateList) {
        storage.setInterceptDateList(dateList);
        background.setLocalInterceptDateList(dateList);
    };

    var syncStatistics = function(statistics) {
        storage.setStatistics(statistics);
        background.setLocalStatistics(statistics);
    };

    var addBlockedSiteAndSync = function(blockedSite) {
        storage.getBlacklist(function(blacklist) {
            if (blacklist.addToList(blockedSite)) {
                syncBlacklist(blacklist);
            }
        })
    };

    return {
        syncBlacklist           : syncBlacklist,
        syncSettings            : syncSettings,
        syncDateList            : syncDateList,
        syncStatistics          : syncStatistics,
        addBlockedSiteAndSync   : addBlockedSiteAndSync
    };

});

// var synchronizer = new Synchronizer();