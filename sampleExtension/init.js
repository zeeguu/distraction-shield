/**
 * Created by edser on 3/15/17.
 */

/* --------------- ---- Session initializer ---- ---------------*/

initSession = function () {
    //First receive the blacklist from the sync storage, and then create a onBeforeRequest listener using this list.
    updateSettings(updateBlockedSites, replaceListener);
    addBrowserActionListener();
};

/* --------------- ---- Run upon installation ---- ---------------*/

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.get(["tds_blacklist", "tds_interceptCounter", "tds_mode", "tds_settings"], function(output) {
        initBlacklist(output.tds_blacklist);
        initInterceptCounter(output.tds_interceptCounter);
        initMode(output.tds_mode);
        initSettings(output.tds_settings);
    });
});

initInterceptCounter = function(counter) {
    if (counter == null) {
        setInterceptionCounter(0);
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

initSettings = function(settings) {
    if (settings == null) {
        settingsToStore = new SettingsObject();
        setStorageSettings(settingsToStore);
    }
};


/* --------------- ---- Run upon Start of session ---- ---------------*/

initSession();