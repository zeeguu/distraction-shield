'use strict';

var _background = require('/Distraction Shield/background');

var _storage = require('./modules/storage');

var storage = _interopRequireWildcard(_storage);

var _BlockedSiteList = require('./classes/BlockedSiteList');

var _BlockedSiteList2 = _interopRequireDefault(_BlockedSiteList);

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//First receive the blacklist and settings from the sync storage,
//then create a onBeforeRequest listener using this list and the settings.
// require.config({
//     baseUrl: "./",
//     paths : {
//         'BlockedSite'       : 'classes/BlockedSite',
//         'BlockedSiteList'   : 'classes/BlockedSiteList',
//         'UserSettings'      : 'classes/UserSettings',
//         'api'               : 'modules/authentication/api',
//         'auth'              : 'modules/authentication/auth',
//         'exerciseTime'      : 'modules/statistics/exerciseTime',
//         'interception'      : 'modules/statistics/interception',
//         'tracker'           : 'modules/statistics/tracker',
//         'blockedSiteBuilder': 'modules/blockedSiteBuilder',
//         'dateutil'          : 'modules/dateutil',
//         'stringutil'          : 'modules/stringutil',
//         'storage'           : 'modules/storage',
//         'synchronizer'      : 'modules/synchronizer',
//         'urlFormatter'      : 'modules/urlFormatter'
//
//     }
// });
//
//
// require( ['background', 'storage', 'BlockedSiteList', 'UserSettings', 'tracker'],
//         function(background, storage, BlockedSiteList, UserSettings, tracker) {
initSession = function initSession() {
    // Settings need to be loaded before the listener is replaced. The replaceListener
    // requires the blocked sites to be loaded, so these weird callbacks are required.
    storage.getSettings(function (settings) {
        settings.reInitTimer();
        (0, _background.setLocalSettings)(settings);
        (0, _background.retrieveBlockedSites)(replaceListener);
    });
    tracker.init();
};

/* --------------- ---- Run upon installation ---- ---------------*/

onInstall = function onInstall() {
    storage.getAllUnParsed(function (output) {
        initBlacklist(output.tds_blacklist);
        initInterceptCounter(output.tds_interceptCounter);
        initInterceptDateList(output.tds_interceptDateList);
        initExerciseTime(output.tds_exerciseTime);
        initSettings(output.tds_settings);
        runIntroTour();
    });
};

initBlacklist = function initBlacklist(list) {
    if (list == null) {
        var blacklistToStore = new _BlockedSiteList2.default.BlockedSiteList();
        storage.setBlacklist(blacklistToStore);
    }
};

initSettings = function initSettings(settings) {
    if (settings == null) {
        var settingsToStore = new _2.default.UserSettings();
        storage.setSettingsWithCallback(settingsToStore, initSession);
    }
};

initInterceptCounter = function initInterceptCounter(counter) {
    if (counter == null) {
        storage.setInterceptCounter(0);
    }
};

initInterceptDateList = function initInterceptDateList(dateList) {
    if (dateList == null) {
        storage.setInterceptDateList([]);
    }
};

initExerciseTime = function initExerciseTime(exerciseTime) {
    if (exerciseTime == null) {
        storage.setExerciseTimeList({});
    }
};

runIntroTour = function runIntroTour() {
    chrome.tabs.create({ 'url': chrome.runtime.getURL('introTour/introTour.html') });
};

/* --------------- ---- Run upon Start of session ---- ---------------*/

if (onInstalledFired) {
    onInstall();
}

//fix that checks whether everything that should be is indeed initialized
storage.getSettingsUnParsed(function (settings) {
    if (settings != null) {
        initSession();
    }
});

// });