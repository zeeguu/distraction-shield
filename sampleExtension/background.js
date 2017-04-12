
//Set that holds the urls to be intercepted
var blockedSites = new BlockedSiteList();
var interceptDateList = [];
var localSettings = new UserSettings();

/* --------------- ------ setter for local variables ------ ---------------*/

setLocalSettings = function(newSettings) {
    localSettings.copySettings(newSettings);
};

setLocalBlacklist = function(newList) {
    blockedSites.setList(newList.getList());
    replaceListener();
};

setLocalInterceptDateList = function(dateList) {
    interceptDateList = dateList;
};

/* --------------- ------ Storage retrieval ------ ---------------*/
// Methods here are only used upon initialization of the session.
// Usage found in init.js

retrieveSettings = function(callback, param) {
    storage.getSettings(function(settingsObject) {
        localSettings = settingsObject;
        return callback(param);
    });
};

retrieveBlockedSites = function(callback){
    storage.getBlacklist(function(blacklist) {
        blockedSites.setList(blacklist.getList());
        return callback();
    });
};

retrieveInterceptDateList = function() {
    storage.getInterceptDateList(function(dateList) {
        interceptDateList = dateList;
    });
};

/* --------------- ------ Updating of variables ------ ---------------*/

addToBlockedSites = function (newUrl, newUrlTitle) {
    urlFormatter.getUrlWithoutServer(newUrl, newUrlTitle, function (url, title) {
        newItem = new BlockedSite(url, title);
        blockedSites.addToList(newItem);
        storage.setBlacklist(blockedSites);
        replaceListener();
    });
};

// This function adds the current time+date to the saved time+date list
addToInterceptDateList = function() {
    var newDate = new Date().toDateString();
    if (interceptDateList == null) {
        interceptDateList = [newDate];
    } else {
        interceptDateList.push(newDate);
    }
    storage.setInterceptDateList(interceptDateList);
};

/* --------------- ------ webRequest functions ------ ---------------*/

replaceListener = function() {
    removeWebRequestListener();
    var urlList = blockedSites.getActiveUrls();
    if (localSettings.getState() == "On" && urlList.length > 0) {
        addWebRequestListener(urlList);
    }
};

addWebRequestListener = function(urlList) {
    chrome.webRequest.onBeforeRequest.addListener(
        handleInterception
        ,{
            urls: urlList
            , types: ["main_frame"]
        }
        ,["blocking"]
    );
};

removeWebRequestListener = function() {
    chrome.webRequest.onBeforeRequest.removeListener(handleInterception);
};

intercept = function(details) {
    storage.incrementInterceptionCounter(details.url);
    addToInterceptDateList();
    var redirectLink;
    var params;
    if (localSettings.getSessionID() == undefined) {
        redirectLink = chrome.extension.getURL('loginPage/login.html');
        // redirectLink = redirectLink + "?forceLogin=" + zeeguuExLink;
        params = "?forceLogin=" + zeeguuExLink;

        // params = "?forceLogin=" + 'https://www.google.nl';
    } else {
        redirectLink = zeeguuExLink + "?sessionID=" + localSettings.getSessionID();
    }
    params = params+"&redirect="+details.url;
    console.log(redirectLink+params);
    return {redirectUrl: redirectLink+params};

};

handleInterception = function(details) {
    if (localSettings.getState() == "On") {
        if (details.url.indexOf("tds_exComplete=true") > -1) {
            turnOfInterception();
            var url = details.url.replace(/(\?tds_exComplete=true|&tds_exComplete=true)/, "");
            return {redirectUrl: url};
        } else {
            return intercept(details);
        }
    }
};

turnOfInterception = function() {
    localSettings.turnOffFromBackground();
    storage.setSettings(localSettings);
};
