import BlockedSiteList from './classes/BlockedSiteList';
import * as interception from './modules/statistics/interception';
import * as storage from './modules/storage';
import UserSettings from  './classes/UserSettings'
import * as constants from'./constants';

/**
 * The BlockedSiteList used by the background
 * @type {BlockedSiteList}
 */
let blockedSites = new BlockedSiteList();
/**
 * The UserSettings used by the background scrript.
 * @type {UserSettings}
 */
let localSettings = new UserSettings();


//TODO remove old function
function replaceListenerNEW(blockedSiteList) {
    removeWebRequestListener();
    let urlList = blockedSiteList.activeUrls;
    if (localSettings.state == "On" && urlList.length > 0) {
        addWebRequestListener(urlList);
    }
}

function addWebRequestListener(urlList) {
    chrome.webRequest.onBeforeRequest.addListener(
        handleInterception
        , {
            urls: urlList
            , types: ["main_frame"]
        }
        , ["blocking"]
    );
}

function removeWebRequestListener() {
    chrome.webRequest.onBeforeRequest.removeListener(handleInterception);
}

/**
 * function that does everything that should happen when we decide to intercept the current request.
 * Incrementing counters and modifying url's
 * @param details details about the current webrequest
 */
function intercept(details) {
    interception.incrementInterceptionCounter(details.url);
    interception.addToInterceptDateList();
    let redirectLink = constants.zeeguuExLink;
    let params = "?redirect=" + details.url + "&from_tds=true";
    return {redirectUrl: redirectLink + params};
}

/**
 * Function which fires when we enter a website on the blockedsite list.
 * If we coe from zeeguu and have completed an exercise than we may continue, else we redirect.
 * @param details the details found by the onWebRequestListener about the current webRequest
 */
function handleInterception(details) {
    if (localSettings.state == "On") {
        if (details.url.indexOf("tds_exComplete=true") > -1) {
            turnOffInterception();
            let url = details.url.replace(/(\?tds_exComplete=true|&tds_exComplete=true)/, "");
            return {redirectUrl: url};
        } else {
            return intercept(details);
        }
    }
}

/**
 * turns off interception from the background
 */
function turnOffInterception() {
    localSettings.turnOffFromBackground(replaceListener);
    storage.setSettings(localSettings);
}

chrome.storage.onChanged.addListener(changes => {
    chrome.extension.getBackgroundPage().console.log("changed! updated listener");
    handleStorageChange(changes)
});

function handleStorageChange(changes){
    if (constants.tds_blacklist in changes) {
        let newBlockedSiteList = BlockedSiteList.deserializeBlockedSiteList(changes[constants.tds_blacklist].newValue);
        replaceListenerNEW(newBlockedSiteList);
    } else if (constants.tds_settings in changes) {
        let newSettings = UserSettings.deserializeSettings(changes[constants.tds_settings].newValue);
        if (localSettings.state != newSettings.state) {
            if (newSettings.state == "On") {
                storage.getBlacklist(blacklist => {
                    replaceListenerNEW(blacklist);
                })
            } else {
                newSettings.reInitTimer();
            }
        }
        localSettings = newSettings;
        console.log(newSettings);
    }
}

export function initBackground(){
    storage.getAll(function (output) {
        replaceListenerNEW(output.tds_blacklist);
    });
}

/*
DEPRECATED
 */

/* --------------- ------ setter for local variables ------ ---------------*/

export function setLocalSettings(newSettings) {
    let oldState = localSettings.state;
    localSettings = newSettings;
    if (oldState != localSettings.state) {
        localSettings.reInitTimer(replaceListener);
        replaceListener();
    }
}

/* --------------- ------ webRequest functions ------ ---------------*/

export function replaceListener() {
    removeWebRequestListener();
    let urlList = blockedSites.activeUrls;
    if (localSettings.state == "On" && urlList.length > 0) {
        addWebRequestListener(urlList);
    }
}

/* --------------- ------ Message Listener ------ ---------------*/
/**
 * Message listener. This listens to message from third party papers, enabling communication between the background scripts
 * and other scripts.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "updateSettings") {
        setLocalSettings(UserSettings.deserializeSettings(request.settings));
    } else if (request.message === "printSettings") {
        console.log(localSettings);
    }
});
