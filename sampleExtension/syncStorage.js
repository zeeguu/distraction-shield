
//Check for a runtime error
handleRuntimeError = function() {
    if (chrome.runtime.error) {
        console.log("Runtime error.\n" + chrome.runtime.error);
        return false;
    }
    return true;
};


/* --------------- ---- Getter functions ---- ---------------*/

/* ------ Blacklist functions ------ */

getStorageBlacklist = function(callback) {
    chrome.storage.sync.get("tds_blacklist", function (output) {
        if(handleRuntimeError()) {
            return callback(output.tds_blacklist);
        }
    });
};

getInterceptCounter = function(callback) {
    chrome.storage.sync.get("tds_interceptCounter", function (output) {
        if(handleRuntimeError()) {
            return callback(output.tds_interceptCounter);
        }
    });
};

getInterceptDateList = function(callback) {
    chrome.storage.sync.get("tds_interceptDateList", function (output) {
        if(handleRuntimeError()) {
            return callback(output.tds_interceptDateList);
        }
    });
};

/* ------ Settings functions ------ */

getStorageMode = function(callback) {
    chrome.storage.sync.get("tds_mode", function (output) {
        if(handleRuntimeError()) {
            return callback(output.tds_mode);
        }
    });
};

getStorageSettings = function(callback) {
    chrome.storage.sync.get("tds_settings", function (output) {
        if(handleRuntimeError()) {
            var deserializedSettings = settings_deserialize(output.tds_settings);
            return callback(deserializedSettings);
        }
    });
};

/* --------------- ---- Setter functions ---- ---------------*/

/* ------ Blacklist functions ------ */

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


/* ------ Statistics functions ------ */
setInterceptionCounter = function(number) {
    chrome.storage.sync.set({"tds_interceptCounter": number}, function () {
        handleRuntimeError();
    });
};

setInterceptDateList = function(dateList) {
    chrome.storage.sync.set({"tds_interceptDateList" : dateList}, function() {
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

/* ------ Settings functions ------ */

setStorageMode= function(mode) {
    chrome.storage.sync.set({"tds_mode": mode}, function() {
        handleRuntimeError();
    });
};

/* ------ Store the current URL ----- */

seStorageOriginalDestination = function(url) {
    chrome.storage.sync.set({"originalDestination": url}, function() {
        handleRuntimeError();
    });
};


/* ----- WIP on Settingsobject ----- */

setStorageSettings = function(settingsObject) {
    var serializedSettings = settings_serialize(settingsObject);
    chrome.storage.sync.set({"tds_settings" : serializedSettings}, function() {
        console.log("called");
        handleRuntimeError();
    });
};