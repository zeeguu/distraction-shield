
/* --------------- ---- Session initializer ---- ---------------*/

initSession = function () {
    //First receive the blacklist and settings from the sync storage,
    //then create a onBeforeRequest listener using this list.
    retrieveSettings(retrieveBlockedSites, replaceListener);
    retrieveInterceptDateList();
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
        setStorageSettingsWithCallback(settingsToStore, initSession);
    }
};


/* --------------- ---- Run upon Start of session ---- ---------------*/

//fix that checks whether everything that should be is initialized
getStorageSettings(function(settings) {
    if (settings != null) {
        initSession();
    }
});