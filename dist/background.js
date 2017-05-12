'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setLocalSettings = setLocalSettings;
exports.setLocalBlacklist = setLocalBlacklist;
exports.setLocalInterceptDateList = setLocalInterceptDateList;
exports.getLocalSettings = getLocalSettings;
exports.retrieveSettings = retrieveSettings;
exports.retrieveBlockedSites = retrieveBlockedSites;
exports.addUrlToBlockedSites = addUrlToBlockedSites;
exports.replaceListener = replaceListener;
exports.addWebRequestListener = addWebRequestListener;
exports.removeWebRequestListener = removeWebRequestListener;
exports.intercept = intercept;
exports.handleInterception = handleInterception;
exports.turnOffInterception = turnOffInterception;
exports.getConsole = getConsole;

var _blockedSiteBuilder = require('/Distraction Shield/modules/blockedSiteBuilder');

var _BlockedSiteList = require('/Distraction Shield/classes/BlockedSiteList');

var _interception = require('/Distraction Shield/modules/statistics/interception');

var interception = _interopRequireWildcard(_interception);

var _storage = require('./modules/storage');

var storage = _interopRequireWildcard(_storage);

var _DistractionShield = require('/Distraction Shield');

var UserSettings = _interopRequireWildcard(_DistractionShield);

var _constants = require('./constants');

var constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//Set that holds the urls to be intercepted
var blockedSites = new _BlockedSiteList.BlockedSiteList();
var interceptDateList = [];
var localSettings = new UserSettings.UserSettings();

/* --------------- ------ setter for local variables ------ ---------------*/

function setLocalSettings(newSettings) {
    var oldState = localSettings.getState();
    localSettings.copySettings(newSettings);
    if (oldState !== localSettings.getState()) {
        replaceListener();
    }
}

function setLocalBlacklist(newList) {
    blockedSites.list = newList.list();
    replaceListener();
}

function setLocalInterceptDateList(dateList) {
    interceptDateList = dateList;
}

function getLocalSettings() {
    return localSettings;
}

/* --------------- ------ Storage retrieval ------ ---------------*/
// Methods here are only used upon initialization of the session.
// Usage found in init.js

function retrieveSettings(callback, param) {
    storage.getSettings(function (settingsObject) {
        localSettings = settingsObject;
        return callback(param);
    });
}

function retrieveBlockedSites(callback) {
    storage.getBlacklist(function (blacklist) {
        blockedSites.list = blacklist.list;
        return callback();
    });
}
/* --------------- ------ Updating of variables ------ ---------------*/

function addUrlToBlockedSites(unformattedUrl, onSuccess) {
    (0, _blockedSiteBuilder.createNewBlockedSite)(unformattedUrl, function (newBS) {
        if (blockedSites.addToList(newBS)) {
            replaceListener();
            storage.setBlacklist(blockedSites);
            onSuccess();
        }
    });
}
/* --------------- ------ webRequest functions ------ ---------------*/

function replaceListener() {
    removeWebRequestListener();
    var urlList = blockedSites.getActiveUrls();
    if (localSettings.getState() === "On" && urlList.length > 0) {
        addWebRequestListener(urlList);
    }
}

function addWebRequestListener(urlList) {
    chrome.webRequest.onBeforeRequest.addListener(handleInterception, {
        urls: urlList,
        types: ["main_frame"]
    }, ["blocking"]);
}

function removeWebRequestListener() {
    chrome.webRequest.onBeforeRequest.removeListener(handleInterception);
}

function intercept(details) {
    interception.incrementInterceptionCounter(details.url, blockedSites);
    interception.addToInterceptDateList();
    var redirectLink = void 0;
    var params = void 0;
    redirectLink = constants.zeeguuExLink;
    params = "?redirect=" + details.url;

    return { redirectUrl: redirectLink + params };
}

function handleInterception(details) {
    if (localSettings.getState() === "On") {
        if (details.url.indexOf("tds_exComplete=true") > -1) {
            turnOffInterception();
            var url = details.url.replace(/(\?tds_exComplete=true|&tds_exComplete=true)/, "");
            return { redirectUrl: url };
        } else {
            return intercept(details);
        }
    }
}

function turnOffInterception() {
    localSettings.turnOffFromBackground();
    storage.setSettings(localSettings);
}

function getConsole() {
    return this.console;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "updateListener") {
        setLocalBlacklist(_BlockedSiteList.BlockedSiteList.deserializeBlockedSiteList(request.siteList));
    } else if (request.message === "updateSettings") {
        setLocalSettings(UserSettings.deserializeSettings(request.settings));
    } else if (request.message === "newUrl") {
        addUrlToBlockedSites(request.unformattedUrl, sendResponse);
    } else if (request.message === "requestBlockedSites") {
        sendResponse({ blockedSiteList: blockedSites });
    }
});