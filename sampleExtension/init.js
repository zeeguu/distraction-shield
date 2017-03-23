/**
 * Created by edser on 3/15/17.
 */

/* --------------- ---- Session initializer ---- ---------------*/

initSession = function () {
    //First receive the blacklist from the sync storage, and then create a onBeforeRequest listener using this list.
    updateBlockedSites(replaceListener);
    updateInterceptDateList();
    addBrowserActionListener();
    addSkipMessageListener();
};

/* --------------- ---- Run upon installation ---- ---------------*/

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.get(["tds_blacklist", "tds_interceptCounter", "tds_interceptDateList", "tds_mode"], function(output) {
        initBlacklist(output.tds_blacklist);
        initInterceptCounter(output.tds_interceptCounter);
        initInterceptDateList(output.tds_interceptDateList);
        initMode(output.tds_mode);
    });
});

initInterceptCounter = function(counter) {
    if (counter == null) {
        setInterceptionCounter(0);
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
        setStorageBlacklist([]);
    }
};


initMode = function(mode) {
    if (mode == null || mode == "") {
        setStorageMode("lazy");
    }
};


/* --------------- ---- Run upon Start of session ---- ---------------*/

initSession();