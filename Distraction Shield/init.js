import * as storage from '/modules/storage'
import * as BlockedSiteList from '/classes/BlockedSiteList'
import * as UserSettings from '/classes/UserSettings'
import Tracker from '/modules/statistics/tracker'


    //First receive the blacklist and settings from the sync storage,
    //then create a onBeforeRequest listener using this list and the settings.
    initSession = function () {
        // Settings need to be loaded before the listener is replaced. The replaceListener
        // requires the blocked sites to be loaded, so these weird callbacks are required.
        storage.getSettings(function(settings) {
            settings.reInitTimer();
            this.setLocalSettings(settings);
            this.retrieveBlockedSites(replaceListener);
        });
        let tracker = new Tracker();
        tracker.init();
    };

    /* --------------- ---- Run upon installation ---- ---------------*/

    onInstall = function() {
        storage.getAllUnParsed(function(output) {
            initBlacklist(output.tds_blacklist);
            initInterceptCounter(output.tds_interceptCounter);
            initInterceptDateList(output.tds_interceptDateList);
            initExerciseTime(output.tds_exerciseTime);
            initSettings(output.tds_settings);
            runIntroTour();
        });
    };

    initBlacklist = function(list) {
        if (list === null) {
            let blacklistToStore = new BlockedSiteList();
            storage.setBlacklist(blacklistToStore);
        }
    };

    initSettings = function(settings) {
        if (settings === null) {
            let settingsToStore = new UserSettings();
            storage.setSettingsWithCallback(settingsToStore, initSession);
        }
    };

    initInterceptCounter = function(counter) {
        if (counter === null) {
            storage.setInterceptCounter(0);
        }
    };

    initInterceptDateList = function(dateList) {
        if (dateList === null) {
            storage.setInterceptDateList([]);
        }
    };

    initExerciseTime = function(exerciseTime){
        if (exerciseTime === null) {
            storage.setExerciseTimeList({});
        }
    };

    runIntroTour = function() {
        chrome.tabs.create({'url': chrome.runtime.getURL('introTour/introTour.html')});
    };

    /* --------------- ---- Run upon Start of session ---- ---------------*/

    if (onInstalledFired) {
        onInstall();
    }

    //fix that checks whether everything that should be is indeed initialized
    storage.getSettingsUnParsed(function(settings) {
        if (settings !== null) {
            initSession();
        }
    });

