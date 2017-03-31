
//Check for a runtime error
handleRuntimeError = function() {
    if (chrome.runtime.error) {
        console.log("Runtime error.\n" + chrome.runtime.error);
        return false;
    }
    return true;
};


/* ---------------- TDS_Storage --------------- */
getStorageAll = function(callback) {
    chrome.storage.sync.get(["tds_blacklist", "tds_interceptCounter", "tds_interceptDateList", "tds_settings"], function(output) {
        if(handleRuntimeError()) {
            if (output.tds_settings != null) {
                output.tds_settings = settings_deserialize(output.tds_settings);
            }
            return callback(output);
        }
    });
};

/* ---------------- Blacklist --------------- */

getStorageBlacklist = function(callback) {
    chrome.storage.sync.get("tds_blacklist", function (output) {
        if(handleRuntimeError()) {
            return callback(output.tds_blacklist);
        }
    });
};

setStorageBlacklist = function(list) {
    chrome.storage.sync.set({"tds_blacklist" : list}, function() {
        handleRuntimeError();
    });
};

setStorageBlacklistWithCallback = function(list, callback) {
    chrome.storage.sync.set({"tds_blacklist" : list}, function() {
        handleRuntimeError();
        return callback();
    });
};

/* ---------------- Interception Counter --------------- */

getInterceptCounter = function(callback) {
    chrome.storage.sync.get("tds_interceptCounter", function (output) {
        if(handleRuntimeError()) {
            return callback(output.tds_interceptCounter);
        }
    });
};

setInterceptionCounter = function(number) {
    chrome.storage.sync.set({"tds_interceptCounter": number}, function () {
        handleRuntimeError();
    });
};

//TODO for iteration 3 remove interceptioncounter integrate to statistics
incrementInterceptionCounter = function(urlAddress) {
    var name = new BlockedSite(urlAddress).name;

    for (var i = 0; i < blockedSites.length; i++) {
        if (blockedSites[i].name == name){
            blockedSites[i].counter++;
        }
    }
    setStorageBlacklist(blockedSites);
    chrome.storage.sync.get("tds_interceptCounter", function(output) {
        var counter = output.tds_interceptCounter;
        counter++;
        chrome.storage.sync.set({"tds_interceptCounter": counter}, function () {
            handleRuntimeError();
        });
    });
};

/* ---------------- Interception DateList --------------- */

getInterceptDateList = function(callback) {
    chrome.storage.sync.get("tds_interceptDateList", function (output) {
        if(handleRuntimeError()) {
            return callback(output.tds_interceptDateList);
        }
    });
};

setInterceptDateList = function(dateList) {
    chrome.storage.sync.set({"tds_interceptDateList" : dateList}, function() {
        handleRuntimeError();
    });
};

/* ---------------- Extension Mode --------------- */

getStorageMode = function(callback) {
    getStorageSettings(function(settings) {
        callback(settings.mode);
    });
};

getStorageInterceptInterval = function(callback) {
    getStorageSettings(function(settings) {
        callback(settings.interceptionInterval);
    });
};

/* ---------------- Original destination --------------- */

getStorageOriginalDestination = function(callback) {
    chrome.storage.sync.get("originalDestination", function (output) {
        if(handleRuntimeError()) {
            return callback(output.originalDestination);
        }
    });
};

setStorageOriginalDestination = function(url) {
    chrome.storage.sync.set({"originalDestination": url}, function() {
        handleRuntimeError();
    });
};


/* ---------------- Settings Object --------------- */

getStorageSettings = function(callback) {
    chrome.storage.sync.get("tds_settings", function (output) {
        if (handleRuntimeError()) {
            var deserializedSettings = null;
            if(output.tds_settings != null) {
                deserializedSettings = settings_deserialize(output.tds_settings);
            }
            return callback(deserializedSettings);
        }
    });
};

setStorageSettings = function(settingsObject) {
    var serializedSettings = settings_serialize(settingsObject);
    chrome.storage.sync.set({"tds_settings": serializedSettings}, function() {
        handleRuntimeError();
    });
};

setStorageSettingsWithCallback = function(settingsObject, callback) {
    var serializedSettings = settings_serialize(settingsObject);
    chrome.storage.sync.set({"tds_settings": serializedSettings}, function() {
        handleRuntimeError();
        return callback();
    });
};
