/* Class meant to make sure that all the data we use, save, store and retrieve
 * keeps synced with all other instances where we use them.
 * This object makes sure that the background, storage and any third instance that holds
 * data all hold the same data. Therefore content scripts as well as custom pages
 * have access to this object and all have one instance of this object. All can use this, there is only one
 * condition on the usage. Every class or piece of code using this, uses it to sync its local data to
 * the rest. In other words, every class is responsible for their own data, this class just forwards this local data
 * to the other classes being the background and the storage.
 *
 * Basic flow for this class:
 *      - Some class or page updates its local data and this data should be synced
 *      - Method on this class is called with locally updated data as parameter
 *      - This class syncs data to other objects
 *
 * If you use this, just include the js file and call function with: synchronizer.functionName()
 */

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

}

var synchronizer = new Synchronizer();