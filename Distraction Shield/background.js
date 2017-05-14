import {createNewBlockedSite} from './modules/blockedSiteBuilder';
import BlockedSiteList from './classes/BlockedSiteList';
import * as interception from './modules/statistics/interception';
import * as storage from './modules/storage';
import UserSettings from  './classes/UserSettings'
import * as constants from'./constants';

//Set that holds the urls to be intercepted
let blockedSites = new BlockedSiteList();
let interceptDateList = [];
let localSettings = new UserSettings();


/* --------------- ------ setter for local variables ------ ---------------*/

export function setLocalSettings(newSettings) {
    let oldState = localSettings.state;
    localSettings.copySettings(newSettings);
    if (oldState !== localSettings.state) {
        replaceListener();
    }
}

export function setLocalBlacklist(newList) {
    blockedSites.list = newList.list();
    replaceListener();
}

export function setLocalInterceptDateList(dateList) {
    interceptDateList = dateList;
}

export function getLocalSettings() {
    return localSettings;
}

/* --------------- ------ Storage retrieval ------ ---------------*/
// Methods here are only used upon initialization of the session.
// Usage found in init.js

export function retrieveSettings(callback, param) {
    storage.getSettings(function (settingsObject) {
        localSettings = settingsObject;
        return callback(param);
    });
}

export function retrieveBlockedSites(callback) {
    storage.getBlacklist(function (blacklist) {
        blockedSites.list = blacklist.list;
        return callback();
    });
}
/* --------------- ------ Updating of variables ------ ---------------*/

export function addUrlToBlockedSites(unformattedUrl, onSuccess) {
    createNewBlockedSite(unformattedUrl, function (newBS) {
        if (blockedSites.addToList(newBS)) {
            replaceListener();
            storage.setBlacklist(blockedSites);
            onSuccess();
        }
    });
}
/* --------------- ------ webRequest functions ------ ---------------*/

export function replaceListener() {
    removeWebRequestListener();
    let urlList = blockedSites.activeUrls;
    if (localSettings.state === "On" && urlList.length > 0) {
        addWebRequestListener(urlList);
    }
}

export function addWebRequestListener(urlList) {
    chrome.webRequest.onBeforeRequest.addListener(
        handleInterception
        , {
            urls: urlList
            , types: ["main_frame"]
        }
        , ["blocking"]
    );
}

export function removeWebRequestListener() {
    chrome.webRequest.onBeforeRequest.removeListener(handleInterception);
}

export function intercept(details) {
    interception.incrementInterceptionCounter(details.url, blockedSites);
    interception.addToInterceptDateList();
    let redirectLink;
    let params;
    redirectLink = constants.zeeguuExLink;
    params = "?redirect=" + details.url;

    return {redirectUrl: redirectLink + params};
}

export function handleInterception(details) {
    if (localSettings.state === "On") {
        if (details.url.indexOf("tds_exComplete=true") > -1) {
            turnOffInterception();
            let url = details.url.replace(/(\?tds_exComplete=true|&tds_exComplete=true)/, "");
            return {redirectUrl: url};
        } else {
            return intercept(details);
        }
    }
}

export function turnOffInterception() {
    localSettings.turnOffFromBackground();
    storage.setSettings(localSettings);
}

export function getConsole() {
    return this.console;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "updateListener") {
        setLocalBlacklist(BlockedSiteList.deserializeBlockedSiteList(request.siteList));
    } else if (request.message === "updateSettings") {
        setLocalSettings(UserSettings.deserializeSettings(request.settings));
    } else if (request.message === "newUrl") {
        addUrlToBlockedSites(request.unformattedUrl, sendResponse);
    } else if (request.message === "requestBlockedSites") {
        sendResponse({blockedSiteList: blockedSites});
    }
});

