"use strict";

//Set that holds the urls to be intercepted
var blockedSites = new BlockedSiteList();
var interceptDateList = [];
var localSettings = new UserSettings();

/* --------------- ------ setter for local variables ------ ---------------*/

setLocalSettings = function setLocalSettings(newSettings) {
    var oldState = localSettings.getState();
    localSettings.copySettings(newSettings);
    if (oldState != localSettings.getState()) {
        replaceListener();
    }
};

setLocalBlacklist = function setLocalBlacklist(newList) {
    blockedSites.setList(newList.getList());
    replaceListener();
};

setLocalInterceptDateList = function setLocalInterceptDateList(dateList) {
    interceptDateList = dateList;
};

/* --------------- ------ Storage retrieval ------ ---------------*/
// Methods here are only used upon initialization of the session.
// Usage found in init.js

retrieveSettings = function retrieveSettings(callback, param) {
    storage.getSettings(function (settingsObject) {
        localSettings = settingsObject;
        return callback(param);
    });
};

retrieveBlockedSites = function retrieveBlockedSites(callback) {
    storage.getBlacklist(function (blacklist) {
        blockedSites.setList(blacklist.getList());
        return callback();
    });
};

/* --------------- ------ Updating of variables ------ ---------------*/

addUrlToBlockedSites = function addUrlToBlockedSites(unformattedUrl, onSuccess) {
    blockedSiteBuilder.createNewBlockedSite(unformattedUrl, function (newBS) {
        if (blockedSites.addToList(newBS)) {
            synchronizer.syncBlacklist(blockedSites);
            onSuccess();
        }
    });
};

/* --------------- ------ webRequest functions ------ ---------------*/

replaceListener = function replaceListener() {
    removeWebRequestListener();
    var urlList = blockedSites.getActiveUrls();
    if (localSettings.getState() == "On" && urlList.length > 0) {
        addWebRequestListener(urlList);
    }
};

addWebRequestListener = function addWebRequestListener(urlList) {
    chrome.webRequest.onBeforeRequest.addListener(handleInterception, {
        urls: urlList,
        types: ["main_frame"]
    }, ["blocking"]);
};

removeWebRequestListener = function removeWebRequestListener() {
    chrome.webRequest.onBeforeRequest.removeListener(handleInterception);
};

intercept = function intercept(details) {
    interception.incrementInterceptionCounter(details.url);
    interception.addToInterceptDateList();
    var redirectLink;
    var params;
    if (!auth.sessionAuthentic) {
        redirectLink = chrome.extension.getURL('loginPage/login.html');
        params = "?forceLogin=" + zeeguuExLink;
    } else {
        redirectLink = zeeguuExLink;
        params = "?sessionID=" + localSettings.getSessionID();
    }
    params = params + "&redirect=" + details.url;

    return { redirectUrl: redirectLink + params };
};

handleInterception = function handleInterception(details) {
    if (localSettings.getState() == "On") {
        if (details.url.indexOf("tds_exComplete=true") > -1) {
            turnOfInterception();
            var url = details.url.replace(/(\?tds_exComplete=true|&tds_exComplete=true)/, "");
            return { redirectUrl: url };
        } else {
            return intercept(details);
        }
    }
};

turnOfInterception = function turnOfInterception() {
    localSettings.turnOffFromBackground();
    storage.setSettings(localSettings);
};