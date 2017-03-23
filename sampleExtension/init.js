/**
 * Created by edser on 3/15/17.
 */

/* --------------- ---- Run upon Start of session ---- ---------------*/

initExtension = function () {
    //First receive the blacklist from the sync storage, and then create a onBeforeRequest listener using this list.
    updateBlockedSites(replaceListener);
    updateInterceptDateList();
    addBrowserActionListener();
};

/* --------------- ---- Run upon installation ---- ---------------*/

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.get(["tds_blacklist", "tds_interceptCounter", "tds_interceptDateList"], function(output) {
        initBlacklist(output.tds_blacklist);
        initInterceptCounter(output.tds_interceptCounter);
        initInterceptDateList(output.tds_interceptDateList);
    });
});

initInterceptCounter = function(counter) {
    if (counter == null) {
        chrome.storage.sync.set({"tds_interceptCounter": []}, function () {
            handleRuntimeError();
        });
    }
};

initInterceptDateList = function(dateList) {
    if (dateList == null) {
        chrome.storage.sync.set({"tds_interceptDateList": []}, function () {
            handleRuntimeError();
        });
    }
};

initBlacklist = function(list) {
    if (list == null) {
        chrome.storage.sync.set({"tds_blacklist": []}, function () {
            handleRuntimeError();
        });
    }
};

/* --------------- ---- --------------------- ---- ---------------*/


initExtension();