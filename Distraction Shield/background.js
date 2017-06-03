import BlockedSiteList from "./classes/BlockedSiteList";
import * as interception from "./modules/statistics/interception";
import * as storage from "./modules/storage";
import UserSettings from "./classes/UserSettings";
import * as constants from "./constants";

function replaceListener(blockedSiteList) {
    removeWebRequestListener();
    storage.getSettings(settings_object => {
        let urlList = blockedSiteList.activeUrls;
        if (settings_object.isOn() && urlList.length > 0) {
            addWebRequestListener(urlList);
        }
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
    //TODO magic string!
    if (details.url.indexOf("tds_exComplete=true") > -1) {
        turnOffInterception();
        removeWebRequestListener();
        let url = details.url.replace(/(\?tds_exComplete=true|&tds_exComplete=true)/, "");
        return {redirectUrl: url};
    } else {
        return intercept(details);
    }
}

/**
 * turns off interception from the background
 */
function turnOffInterception() {
    storage.getSettings(settings_object => {
        settings_object.turnOffFromBackground();
    })
}

chrome.storage.onChanged.addListener(changes => {
    handleStorageChange(changes)
});

function handleStorageChange(changes){
    if (constants.tds_blacklist in changes) {
        let newBlockedSiteList = BlockedSiteList.deserializeBlockedSiteList(changes[constants.tds_blacklist].newValue);
        let oldBlockedSiteList = BlockedSiteList.deserializeBlockedSiteList(changes[constants.tds_blacklist].oldValue);
        if (!oldBlockedSiteList || newBlockedSiteList.length !== oldBlockedSiteList.length)
            replaceListener(newBlockedSiteList);
    }
    if (constants.tds_settings in changes) {
        let newSettings = UserSettings.deserializeSettings(changes[constants.tds_settings].newValue);
        let oldSettings = UserSettings.deserializeSettings(changes[constants.tds_settings].oldValue);
        if (!newSettings.isOn()) {
            removeWebRequestListener();
            newSettings.reInitTimer();
        } else if (!oldSettings || !oldSettings.isOn())
            storage.getBlacklist(blockedSiteList => replaceListener(blockedSiteList));
    }
}

export function initBackground(){
    storage.getAll(function (output) {
        replaceListener(output.tds_blacklist);
    });
}
