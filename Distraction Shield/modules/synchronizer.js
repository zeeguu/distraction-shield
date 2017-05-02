
define('synchronizer', ['storage', 'BlockedSiteList', 'UserSettings'],
    function Synchronizer(storage, BlockedSiteList, UserSettings) {

    var syncBlacklist = function(blockedSiteList) {
        storage.setBlacklist(blockedSiteList);
        chrome.runtime.sendMessage( {   message: "replaceListener",
                                        siteList: BlockedSiteList.serializeBlockedSiteList(blockedSiteList)
                                    });
    };

    var syncSettings = function(settings) {
        storage.setSettings(settings);
        chrome.runtime.sendMessage( {   message: "updateSettings",
                                        settings: UserSettings.serializeSettings(settings)
        });
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
        addBlockedSiteAndSync   : addBlockedSiteAndSync
    };

});

// var synchronizer = new Synchronizer();