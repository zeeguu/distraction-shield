import {setLocalSettings, retrieveBlockedSites, replaceListener} from './background';
import * as storage from './modules/storage';
import BlockedSiteList from './classes/BlockedSiteList';
import UserSettings from './classes/UserSettings';
import Tracker from './modules/statistics/tracker';

/* --------------- ---- Run upon installation ---- ---------------*/

chrome.runtime.onInstalled.addListener(function() {
    storage.getAllUnParsed(function (output) {
        initBlacklist(output.tds_blacklist);
        initInterceptCounter(output.tds_interceptCounter);
        initInterceptDateList(output.tds_interceptDateList);
        initExerciseTime(output.tds_exerciseTime);
        initSettings(output.tds_settings);
        runIntroTour();
    });
});

function initBlacklist(list) {
    if (list == null) {
        let blacklistToStore = new BlockedSiteList();
        storage.setBlacklist(blacklistToStore);
    }
}

function initSettings(settings) {
    if (settings == null) {
        let settingsToStore = new UserSettings();
        storage.setSettingsWithCallback(settingsToStore, initSession);
    }
}


function initInterceptCounter(counter) {
    if (counter == null) {
        storage.setInterceptCounter(0);
    }
}

function initInterceptDateList(dateList) {
    if (dateList == null) {
        storage.setInterceptDateList([]);
    }
}

function initExerciseTime(exerciseTime) {
    if (exerciseTime == null) {
        storage.setExerciseTimeList({});
    }
}

function runIntroTour() {
    chrome.tabs.create({'url': chrome.runtime.getURL('introTour/introTour.html')});
}

/* --------------- ---- Run upon Start of session ---- ---------------*/

//First receive the blacklist and settings from the sync storage,
//then create a onBeforeRequest listener using this list and the settings.
function initSession() {
    // Settings need to be loaded before the listener is replaced. The replaceListener
    // requires the blocked sites to be loaded, so these weird callbacks are required.
    storage.getSettings(function (settings) {
        settings.reInitTimer(replaceListener);
        setLocalSettings(settings);
        retrieveBlockedSites(replaceListener);
    });
    //let tracker = new Tracker();
    //tracker.init(); //TODO fix this
}

//fix that checks whether everything that should be is indeed initialized
storage.getSettingsUnParsed(function (settings) {
    if (settings != null) {
        initSession();
    }
});

