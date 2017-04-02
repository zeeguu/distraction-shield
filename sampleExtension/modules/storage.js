
//Check for a runtime error
handleRuntimeError = function() {
    if (chrome.runtime.error) {
        console.log("Runtime error.\n" + chrome.runtime.error);
        return false;
    }
    return true;
};

function SyncStorage() {

    /* ---------------- TDS_Storage --------------- */
    this.getAll = function(callback) {
        chrome.storage.sync.get(null, function(output) {
            if (handleRuntimeError()) {
                output.tds_settings = settings_deserialize(output.tds_settings);
                output.tds_blacklist = blockedSiteList_deserialize(output.tds_blacklist);
                return callback(output);
            }
        });
    };

    this.getStatistics = function(callback) {
        chrome.storage.sync.get(["tds_interceptCounter", "tds_interceptDateList"], function(output) {
            if (handleRuntimeError()) {
                return callback(output);
            }
        });
    };

    /* ---------------- Blacklist --------------- */

    this.getBlacklist = function(callback) {
        chrome.storage.sync.get("tds_blacklist", function(output) {
            if (handleRuntimeError()) {
                output.tds_blacklist = blockedSiteList_deserialize(output.tds_blacklist);
                return callback(output.tds_blacklist);
            }
        });
    };

    this.setBlacklist = function(blockedSiteList) {
        var serializedList = blockedSiteList_serialize(blockedSiteList);
        chrome.storage.sync.set({"tds_blacklist": serializedList}, function() {
            handleRuntimeError();
        });
    };

    this.setBlacklistWithCallback = function(blockedSiteList, callback) {
        var serializedList = blockedSiteList_serialize(blockedSiteList);
        chrome.storage.sync.set({"tds_blacklist": serializedList}, function() {
            handleRuntimeError();
            return callback();
        });
    };

    /* ---------------- Interception Counter --------------- */

    this.getInterceptCounter = function(callback) {
        chrome.storage.sync.get("tds_interceptCounter", function(output) {
            if (handleRuntimeError()) {
                return callback(output.tds_interceptCounter);
            }
        });
    };

    this.setInterceptionCounter = function(number) {
        chrome.storage.sync.set({"tds_interceptCounter": number}, function() {
            handleRuntimeError();
        });
    };

    //TODO for iteration 3 remove interceptioncounter integrate to statistics
    this.incrementInterceptionCounter = function(urlAddress) {
        urlList = blockedSites.getList();
        for (var i = 0; i < urlList.length; i++) {
            if (wildcardStrComp(urlAddress, urlList[i].getUrl())) {
                urlList[i].setCounter(urlList[i].getCounter() + 1);
                break;
            }
        }
        this.setBlacklist(blockedSites);
        chrome.storage.sync.get("tds_interceptCounter", function(output) {
            var counter = output.tds_interceptCounter;
            counter++;
            chrome.storage.sync.set({"tds_interceptCounter": counter}, function() {
                handleRuntimeError();
            });
        });
    };

    /* ---------------- Interception DateList --------------- */

    this.getInterceptDateList = function(callback) {
        chrome.storage.sync.get("tds_interceptDateList", function(output) {
            if (handleRuntimeError()) {
                return callback(output.tds_interceptDateList);
            }
        });
    };

    this.setInterceptDateList = function(dateList) {
        chrome.storage.sync.set({"tds_interceptDateList": dateList}, function() {
            handleRuntimeError();
        });
    };

    /* ---------------- Settings Object --------------- */

    this.getSettings = function(callback) {
        chrome.storage.sync.get("tds_settings", function(output) {
            if (handleRuntimeError()) {
                var deserializedSettings = settings_deserialize(output.tds_settings);
                return callback(deserializedSettings);
            }
        });
    };

    this.setSettings = function(settingsObject) {
        var serializedSettings = settings_serialize(settingsObject);
        chrome.storage.sync.set({"tds_settings": serializedSettings}, handleRuntimeError);
    };

    this.setSettingsWithCallback = function(settingsObject, callback) {
        var serializedSettings = settings_serialize(settingsObject);
        chrome.storage.sync.set({"tds_settings": serializedSettings}, function() {
            handleRuntimeError();
            return callback();
        });
    };

    this.getMode = function(callback) {
        this.getSettings(function(settings) {
            callback(settings.getMode());
        });
    };
}

//Fancy string comparison with wildcards
wildcardStrComp = function(str, rule) {
    return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
};

var storage = new SyncStorage();