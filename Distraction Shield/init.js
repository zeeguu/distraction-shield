import {initBackground} from './background';
import * as storage from './modules/storage';
import BlockedSiteList from './classes/BlockedSiteList';
import UserSettings from './classes/UserSettings';
import Tracker from './modules/statistics/tracker';
import * as constants from'./constants';

/* --------------- ---- Run upon installation ---- ---------------*/

/**
 * function to be fired only when the extension is installed or updated. It initiates all the data and the storage.
 * Furthermore it shows the intro tour and initializes the extension upon completion.
 */
chrome.runtime.onInstalled.addListener((details) => {
    storage.getAllUnParsed((output) => {
        initBlacklist(output.tds_blacklist);
        initInterceptCounter(output.tds_interceptCounter);
        initInterceptDateList(output.tds_interceptDateList);
        initExerciseTime(output.tds_exerciseTime);
        initSettings(output.tds_settings);
        if (details.reason == 'install') {
            dataCollectionMsg ();
            runIntroTour();
        }
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
        storage.setExerciseTimeList([]);
    }
}

function dataCollectionMsg () {
    alert (constants.dataCollectionMsg);
}

function runIntroTour() {
    chrome.tabs.create({'url': chrome.runtime.getURL('introTour/introTour.html')});
}

/**
 * function which checks whether we run a normal session or the special case where the onInstalled function is called.
 */
storage.getSettingsUnParsed(function (settings) {
    if (settings != null) {
        initSession();
    }
});

/* --------------- ---- Run upon Start of session ---- ---------------*/

/**
 * function which fires upon starting the browser. Initiates the session, like listener and list of blocked sites.
 */
function initSession() {
    storage.getSettings(function (settings) {
        settings.reInitTimer();
    });
    let tracker = new Tracker();
    tracker.init();
    initBackground();
}