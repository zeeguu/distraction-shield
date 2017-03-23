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

getStorageBlacklist = function(callback) {
    chrome.storage.sync.get("tds_blacklist", function (output) {
        if(handleRuntimeError()) {
            return callback(output.tds_blacklist);
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
        var counter = output.tds_interceptCounter.count;
        counter++;
        chrome.storage.sync.set({"tds_interceptCounter": counter}, function () {
            handleRuntimeError();
        });
    });
};