/**
 * Created by edser on 3/15/17.
 */

/* --------------- ---- Error handler ---- ---------------*/

var console = chrome.extension.getBackgroundPage().console;

//Check for a runtime error
handleRuntimeError = function() {
    if (chrome.runtime.error) {
        console.log("Runtime error.\n" + chrome.runtime.error);
        return false;
    }
    return true;
};


/* --------------- ---- Getter functions ---- ---------------*/

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

/* --------------- ---- Setter functions ---- ---------------*/

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

setInterceptDateList = function(list) {
    chrome.storage.sync.set({"tds_interceptDateList" : list}, function() {
        handleRuntimeError();
    });
};

setInterceptCounter = function(counter) {
    chrome.storage.sync.set({"tds_interceptCounter" : counter}, function() {
        handleRuntimeError();
    });
};

/* ------ Statistics functions ------ */


incrementInterceptionCounter = function(urlAddress) {
    var name=new BlockedSite(urlAddress).name;
    for (var i=0; i<blockedSites.length; i++) {
        if (blockedSites[i].name==name){
            blockedSites[i].counter++;
        }
    }
    setStorageBlacklist (blockedSites);
    chrome.storage.sync.get("tds_interceptCounter", function(output) {
        var counter = output.tds_interceptCounter;
        counter++;
        chrome.storage.sync.set({"tds_interceptCounter": counter}, function () {
            handleRuntimeError();
        });
    });
};