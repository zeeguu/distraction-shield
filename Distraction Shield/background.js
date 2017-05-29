import {createNewBlockedSite} from './modules/blockedSiteBuilder';
import BlockedSiteList from './classes/BlockedSiteList';
import * as interception from './modules/statistics/interception';
import * as storage from './modules/storage';
import UserSettings from  './classes/UserSettings'
import * as constants from'./constants';

//Set that holds the urls to be intercepted
let blockedSites = new BlockedSiteList();
let localSettings = new UserSettings();

/* --------------- ------ setter for local variables ------ ---------------*/

export function setLocalSettings(newSettings) {
    let oldState = localSettings.state;
    localSettings = newSettings;
    if (oldState != localSettings.state) {
        localSettings.reInitTimer(replaceListener);
        replaceListener();
    }
}

function setLocalBlacklist(newList) {
    blockedSites.list = newList.list;
    replaceListener();
}

/* --------------- ------ Storage retrieval ------ ---------------*/

export function retrieveBlockedSites(callback) {
    storage.getBlacklist(function (blacklist) {
        blockedSites.list = blacklist.list;
        return callback();
    });
}
/* --------------- ------ Updating of variables ------ ---------------*/

function addUrlToBlockedSites(unformattedUrl, onSuccess) {
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

function intercept(details) {
    interception.incrementInterceptionCounter(details.url);
    interception.addToInterceptDateList();
<<<<<<< HEAD
    let redirectLink = constants.zeeguuExLink;
    let params = "?redirect=" + details.url + "&from_tds=true";

=======
    var redirectLink = zeeguuExLink;
    var params = "?redirect="+details.url;
>>>>>>> development
    return {redirectUrl: redirectLink + params};
}

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

function turnOffInterception() {
    localSettings.turnOffFromBackground(replaceListener);
    storage.setSettings(localSettings);
}

/* --------------- ------ Message Listener ------ ---------------*/

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "updateListener") {
        setLocalBlacklist(BlockedSiteList.deserializeBlockedSiteList(request.siteList));
    } else if (request.message === "updateSettings") {
        setLocalSettings(UserSettings.deserializeSettings(request.settings));
    } else if (request.message === "newUrl") {
        addUrlToBlockedSites(request.unformattedUrl, sendResponse);
    } else if (request.message === "requestBlockedSites") {
        let siteList = BlockedSiteList.serializeBlockedSiteList(blockedSites);
        sendResponse({blockedSiteList: siteList});
    } else if (request.message === "printSettings") {
        console.log(localSettings);
    }
});
