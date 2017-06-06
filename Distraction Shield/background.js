/**
 * The functions that form the functionality of the extension that takes place in the background.
 * @module background
 */

import BlockedSiteList from './classes/BlockedSiteList';
import * as interception from './modules/statistics/interception';
import * as storage from './modules/storage/storage';
import UserSettings from  './classes/UserSettings'
import * as constants from'./constants';
import {isInRegexList} from './modules/stringutil';
import StorageListener from './modules/storage/StorageListener'

/**
 * Unfortunately are webrequestlisteners not able to process asynchronous functions.
 * Therefore we need a global variable to keep track of the state of the extension.
 * @type {boolean}
 */

let isInterceptionOn = true;

export function initBackground(){
    storage.getBlacklist(function (blockedSiteList) {
        replaceListener(blockedSiteList);
    });
}

/* ---------- ---------- Webrequest functions ----------  ---------- */

function replaceListener(blockedSiteList) {
    removeWebRequestListener();
    storage.getSettings(settings_object => {
        let urlList = blockedSiteList.activeUrls;
        if (settings_object.isInterceptionOn() && urlList.length > 0)
            addWebRequestListener(urlList);
    })
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


/* ---------- ---------- Interception functions ----------  ---------- */

/**
 * function that does everything that should happen when we decide to intercept the current request.
 * Incrementing counters and modifying url's
 * @param details details about the current webrequest
 */
function intercept(details) {
    interception.incrementInterceptionCounter(details.url);
    interception.addToInterceptDateList();
    let redirectLink = constants.zeeguuExLink;
    let params = constants.tdsRedirectParam + details.url;
    return {redirectUrl: redirectLink + params};
}

/**
 * Function which fires when we enter a website on the blockedsite list.
 * If we come from zeeguu and have completed an exercise than we may continue, else we redirect.
 * @param details the details found by the onWebRequestListener about the current webRequest
 */
function handleInterception(details) {
    console.log("whitelist: " + JSON.stringify(constants.whitelist));
    console.log("url: " + details.url);
    if (!isInRegexList(constants.whitelist, details.url)) {
        console.log("not in regexList");
    } else {
        console.log("in regexList");
    }

    if (isInterceptionOn && !isInRegexList(constants.whitelist, details.url)) {
        if (constants.exerciseCompleteRegex.test(details.url)) {
            let url = details.url.replace(constants.exerciseCompleteRegex, "");
            turnOffInterception();
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
    isInterceptionOn = false;
    storage.getSettings(settings_object => {
        settings_object.turnOffFor(settings_object.interceptionInterval, true);
    })
}

/* ---------- ---------- Storage Listener ----------  ---------- */

/**
 * Actual function that is fired upon the change in storage. If the blockedSiteList changes,
 * we update our listener. If the settings change we encorperate this in the background's behaviour.
 * @param changes data passed by the storage.onChanged event
 */
new StorageListener((changes) => {
    if (constants.tds_blacklist in changes) {
        let newBlockedSiteList = BlockedSiteList.deserializeBlockedSiteList(changes[constants.tds_blacklist].newValue);
        replaceListener(newBlockedSiteList);
    }
    if (constants.tds_settings in changes) {
        let newSettings = UserSettings.deserializeSettings(changes[constants.tds_settings].newValue);
        let oldSettings = UserSettings.deserializeSettings(changes[constants.tds_settings].oldValue);
        isInterceptionOn = newSettings.isInterceptionOn();
        if (!newSettings.isInterceptionOn())
            newSettings.reInitTimer();
        else if (!oldSettings || !oldSettings.isInterceptionOn())
            storage.getBlacklist(blockedSiteList => replaceListener(blockedSiteList));
    }
});

