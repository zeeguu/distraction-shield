/**
 * Created by edser on 3/15/17.
 */

/* --------------- ---- Error handler ---- ---------------*/

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

/* ------ Settings functions ------ */

getStorageMode= function(callback) {
    chrome.storage.sync.get("tds_mode", function (output) {
        if(handleRuntimeError()) {
            return callback(output.tds_mode);
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

incrementInterceptionCounter = function() {
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
