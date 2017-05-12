'use strict';

define('background', ['blockedSiteBuilder', 'BlockedSiteList', 'interception', 'tracker', 'UserSettings', 'constants', 'storage'], function background(blockedSiteBuilder, BlockedSiteList, interception, tracker, UserSettings, constants, storage) {
    //Set that holds the urls to be intercepted
    var blockedSites = new BlockedSiteList.BlockedSiteList();
    var interceptDateList = [];
    var localSettings = new UserSettings.UserSettings();
    var authenticator;

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

    setLocalAuthenticator = function setLocalAuthenticator(newAuthenticator) {
        authenticator = newAuthenticator;
    };

    setLocalInterceptDateList = function setLocalInterceptDateList(dateList) {
        interceptDateList = dateList;
    };

    getLocalSettings = function getLocalSettings() {
        return localSettings;
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
                replaceListener();
                storage.setBlacklist(blockedSites);
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
        interception.incrementInterceptionCounter(details.url, blockedSites);
        interception.addToInterceptDateList();
        var redirectLink;
        var params;
        redirectLink = constants.zeeguuExLink;
        params = "?redirect=" + details.url;

        return { redirectUrl: redirectLink + params };
    };

    handleInterception = function handleInterception(details) {
        if (localSettings.getState() == "On") {
            if (details.url.indexOf("tds_exComplete=true") > -1) {
                turnOffInterception();
                var url = details.url.replace(/(\?tds_exComplete=true|&tds_exComplete=true)/, "");
                return { redirectUrl: url };
            } else {
                return intercept(details);
            }
        }
    };

    turnOffInterception = function turnOffInterception() {
        localSettings.turnOffFromBackground();
        storage.setSettings(localSettings);
    };

    getConsole = function getConsole() {
        return this.console;
    };

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.message == "updateListener") {
            setLocalBlacklist(BlockedSiteList.deserializeBlockedSiteList(request.siteList));
        } else if (request.message == "updateSettings") {
            setLocalSettings(UserSettings.deserializeSettings(request.settings));
        } else if (request.message == "newUrl") {
            addUrlToBlockedSites(request.unformattedUrl, sendResponse);
        } else if (request.message == "requestBlockedSites") {
            sendResponse({ blockedSiteList: blockedSites });
        }
    });

    return {
        getLocalSettings: getLocalSettings,
        setLocalSettings: setLocalSettings,
        setLocalBlacklist: setLocalBlacklist,
        setLocalInterceptDateList: setLocalInterceptDateList,
        retrieveSettings: retrieveSettings,
        retrieveBlockedSites: retrieveBlockedSites,
        addUrlToBlockedSites: addUrlToBlockedSites,
        replaceListener: replaceListener,
        addWebRequestListener: addWebRequestListener,
        removeWebRequestListener: removeWebRequestListener,
        intercept: intercept,
        handleInterception: handleInterception,
        turnOffInterception: turnOffInterception,
        getConsole: getConsole
    };
});