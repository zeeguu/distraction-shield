
//Set that holds the urls to be intercepted
var blockedSites = new BlockedSiteList();
var interceptDateList = [];
var localSettings = new UserSettings();

/* --------------- ------ setter for local variables ------ ---------------*/

setLocalSettings = function(newSettings) {
    var oldState = localSettings.getState();
    localSettings.copySettings(newSettings);
    if (oldState != localSettings.getState()) {
        replaceListener();
    }
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

/* --------------- ------ Updating of variables ------ ---------------*/

addUrlToBlockedSites = function(unformattedUrl, onSuccess) {
    blockedSiteBuilder.createNewBlockedSite(unformattedUrl, function(newBS) {
        if (blockedSites.addToList(newBS)) {
            storage.setBlacklist(blockedSites);
            onSuccess();
        } 
    });
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
    interception.incrementInterceptionCounter(details.url);
    interception.addToInterceptDateList();
    auth.authenticateSession().then(function () {
        //resolution
        var redirectLink;
        var params;
        if (!localSettings.getSessionID()) {
            redirectLink = chrome.extension.getURL('loginPage/login.html');
            params = "?forceLogin=" + zeeguuExLink;
        } else {
            redirectLink = zeeguuExLink;
            params = "?sessionID=" + localSettings.getSessionID();
        }
        params = params+"&redirect="+details.url;
        setCurrentTabLocation(redirectLink+params);
    }, function rejection () {
        //rejection
        var redirectLink = chrome.extension.getURL('loginPage/login.html');
        var params = "?forceLogin=" + zeeguuExLink;
        params = params+"&redirect="+details.url;
        setCurrentTabLocation(redirectLink+params);
    });
};

setCurrentTabLocation = function (location) {
  chrome.tabs.query({currentWindow: true, active:true},function (tabs) {
      var id = tabs[0].id;
      chrome.tabs.update(id, {url: location});
  })
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
