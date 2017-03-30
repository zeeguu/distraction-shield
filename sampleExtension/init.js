
/* --------------- ---- Session initializer ---- ---------------*/

initSession = function () {
    //First receive the blacklist from the sync storage, and then create a onBeforeRequest listener using this list.
    retrieveSettings(retrieveBlockedSites, replaceListener);
    retrieveInterceptDateList();
    addBrowserActionListener();
    addSkipMessageListener();
};

/* --------------- ---- Run upon installation ---- ---------------*/

chrome.runtime.onInstalled.addListener(function() {
    getStorageAll( function(output) {
        initBlacklist(output.tds_blacklist);
        initInterceptCounter(output.tds_interceptCounter);
        initInterceptDateList(output.tds_interceptDateList);
        initSettings(output.tds_settings);
    });
});

initInterceptCounter = function(counter) {
    if (counter == null) {
        setInterceptionCounter(0);
    }
};

initInterceptDateList = function(dateList) {
    if (dateList == null) {
        setInterceptDateList(dateList);
    }
};

initBlacklist = function(list) {
    if (list == null) {
        setStorageBlacklist([]);
    }
};

initSettings = function(settings) {
    if (settings == null) {
        settingsToStore = new SettingsObject();
        setStorageSettings(settingsToStore);
    }
};


/* --------------- ---- Run upon Start of session ---- ---------------*/

//TODO fix need to refresh page/extension before extension works
setTimeout(initSession, 1000);