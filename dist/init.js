'use strict';

var _background = require('./background');

var _storage = require('./modules/storage');

var storage = _interopRequireWildcard(_storage);

var _BlockedSiteList = require('./classes/BlockedSiteList');

var _tracker = require('./modules/statistics/tracker');

var _tracker2 = _interopRequireDefault(_tracker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* --------------- ---- Run upon installation ---- ---------------*/

function onInstall() {
    storage.getAllUnParsed(function (output) {
        initBlacklist(output.tds_blacklist);
        initInterceptCounter(output.tds_interceptCounter);
        initInterceptDateList(output.tds_interceptDateList);
        initExerciseTime(output.tds_exerciseTime);
        initSettings(output.tds_settings);
        runIntroTour();
    });
}

function initBlacklist(list) {
    if (list === null) {
        var blacklistToStore = new _BlockedSiteList.BlockedSiteList.BlockedSiteList();
        storage.setBlacklist(blacklistToStore);
    }
}

function initSettings(settings) {
    if (settings === null) {
        var settingsToStore = new UserSettings.UserSettings();
        storage.setSettingsWithCallback(settingsToStore, initSession);
    }
}

function initInterceptCounter(counter) {
    if (counter === null) {
        storage.setInterceptCounter(0);
    }
}

function initInterceptDateList(dateList) {
    if (dateList === null) {
        storage.setInterceptDateList([]);
    }
}

function initExerciseTime(exerciseTime) {
    if (exerciseTime === null) {
        storage.setExerciseTimeList({});
    }
}

function runIntroTour() {
    chrome.tabs.create({ 'url': chrome.runtime.getURL('introTour/introTour.html') });
}

/* --------------- ---- Run upon Start of session ---- ---------------*/

//First receive the blacklist and settings from the sync storage,
//then create a onBeforeRequest listener using this list and the settings.
function initSession() {
    // Settings need to be loaded before the listener is replaced. The replaceListener
    // requires the blocked sites to be loaded, so these weird callbacks are required.
    storage.getSettings(function (settings) {
        settings.reInitTimer();
        (0, _background.setLocalSettings)(settings);
        (0, _background.retrieveBlockedSites)(_background.replaceListener);
    });
    var tracker = new _tracker2.default();
    tracker.init();
}

if (onInstalledFired) {
    onInstall();
}

//fix that checks whether everything that should be is indeed initialized
storage.getSettingsUnParsed(function (settings) {
    if (settings !== null) {
        initSession();
    }
});