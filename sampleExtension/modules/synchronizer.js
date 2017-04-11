
function Synchronizer() {
    var self = this;
    this.bg = chrome.extension.getBackgroundPage();

    this.syncBlacklist = function(blockedSiteList) {
        storage.setBlacklist(blockedSiteList);
        self.bg.setLocalBlacklist(blockedSiteList);
    };

    this.syncSettings = function(settings) {
        storage.setSettings(settings);
        self.bg.setLocalSettings(settings);
    };

    this.syncDateList = function(dateList) {
        storage.setInterceptDateList(dateList);
        self.bg.setLocalInterceptDateList(dateList);
    };

    this.syncStatistics = function(statistics) {
        storage.setStatistics(statistics);
        self.bg.setLocalStatistics(statistics);
    };

    this.addBlockedSiteAndSync = function(blockedSite) {
        storage.getBlacklist(function(blacklist) {
            if (blacklist.addToList(blockedSite)) {
                self.syncBlacklist(blacklist);
            }
        })
    }

}

var synchronizer = new Synchronizer();