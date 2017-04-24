
//Check for a runtime error
handleRuntimeError = function() {
    if (chrome.runtime.error) {
        console.log("Runtime error.\n" + chrome.runtime.error);
        return false;
    }
    return true;
};

function SyncStorage() {
    var self = this;

    /* ---------------- TDS_Storage --------------- */
    this.getAll = function(callback) {
        self.getStorage(null).then(function(output) {
            output.tds_settings = deserializeSettings(output.tds_settings);
            output.tds_blacklist = deserializeBlockedSiteList(output.tds_blacklist);
            return callback(output);
        });
    };

    /* ---------------- Blacklist --------------- */

    this.getBlacklist = function(callback) {
        self.getStorage("tds_blacklist").then(function(output) {
            output.tds_blacklist = deserializeBlockedSiteList(output.tds_blacklist);
            return callback(output.tds_blacklist);
        });
    };

    this.setBlacklist = function(blockedSiteList) {
        var serializedList = serializeBlockedSiteList(blockedSiteList);
        self.setStorage("tds_blacklist", serializedList);
    };

    /* ---------------- Settings Object --------------- */

    this.getSettings = function(callback) {
        self.getStorage("tds_settings").then(function(output) {
            var deserializedSettings = deserializeSettings(output.tds_settings);
            return callback(deserializedSettings);
        });
    };

    this.setSettings = function(settingsObject) {
        self.setStorage("tds_settings", serializeSettings(settingsObject));
    };

    this.setSettingsWithCallback = function(settingsObject, callback) {
        var serializedSettings = serializeSettings(settingsObject);
        self.setStorage("tds_settings", serializedSettings).then(function(){
            return callback()
        });
    };

    this.getMode = function(callback) {
        this.getSettings(function(settings) {
            callback(settings.getMode());
        });
    };

    /* ---------------- Statistics --------------- */

    this.getInterceptCounter = function() {
        return self.getStorage("tds_interceptCounter");
    };

    this.setInterceptionCounter = function(number) {
        return self.setStorage("tds_interceptCounter", number);
    };

    this.setInterceptDateList = function(dateList) {
        return self.setStorage("tds_interceptDateList", dateList);
    };

    this.getInterceptDateList = function(){
        return self.getStorage("tds_interceptDateList");
    };

    this.setExerciseTimeList = function(statList){
        return self.setStorage("tds_exerciseTime", statList);
    };

    this.getExerciseTimeList = function(){
        return self.getStorage(["tds_exerciseTime"]);
    };

    /* ---------------- General methods --------------- */

    // General function which is used to set items stored in the storage of the chrome api.
    // Returns a promise.
    this.setStorage = function(dataKey, dataValue) {
        return new Promise(function(resolve, reject){
            var newObject= {};
            newObject[dataKey] = dataValue;
            chrome.storage.sync.set(newObject, function() {
                if(handleRuntimeError()){
                    resolve();
                } else {
                    reject(Error("Data cannot be set."));
                }
            })
        });
    };

    // General function which is used to retrieve items stored in the storage of the chrome api.
    // This function returns a Promise, to account for possible delays which might exist between the requesting of
    // the things in the storage and the actual retrieving of it.
    this.getStorage = function(dataKey){
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(dataKey, function (output) {
                if (handleRuntimeError()) {
                    if(dataKey == null || dataKey.length > 1){
                        resolve(output);
                    } else {
                        resolve(output[dataKey]);
                    }
                } else {
                    reject(Error("Data cannot be found."));
                }
            })
        });
    };
}

//Fancy string comparison with wildcards
wildcardStrComp = function(str, rule) {
    return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
};

var storage = new SyncStorage();