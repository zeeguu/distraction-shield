
//Set that holds the urls to be intercepted
var blockedSites = [];
var interceptCounter = 0;
var interceptDateList = [];
//Boolean that determines whether we should be redirecting or not
var interceptionEnabled = true;
var localSettings = null; /* Settings WIP */


/* --------------- ------ update list of BlockedSites ------ ---------------*/

updateStorage = function() {
    setStorageBlacklist(blockedSites);
};


// This function receives the settings from the sync storage.
retrieveSettings = function(callback, param) {
    getStorageSettings(function(settingsObject) {
        localSettings = settingsObject;
        return callback(param);
    });
};

// This function receives the blacklist from the sync storage.
retrieveBlockedSites = function(callback){
    getStorageBlacklist(function(blacklist) {
        blockedSites = blacklist;
        return callback();
    });
};

//Loads the intercept time+date list from storage
retrieveInterceptDateList = function() {
    getInterceptDateList(function(dateList) {
        interceptDateList = dateList;
    });
};

//Loads the intercept counter from storage
retrieveInterceptCounter = function(callback) {
    getInterceptCounter(function(counter) {
        interceptCounter = counter;
        return callback();
    });
};

// This function adds one url to the blacklist
addToBlockedSites = function(urlToAdd) {
    var blockedSiteItem = new BlockedSite(formatUrl(urlToAdd));
    blockedSites.push(blockedSiteItem);
    updateStorage();
    replaceListener();
};

// This function adds the current time+date to the saved time+date list
addToInterceptDateList = function() {
    var newDate = new Date().toDateString();
    if (interceptDateList == null) {
        interceptDateList = [newDate];
    } else {
        interceptDateList.push(newDate);
    }
    setInterceptDateList(interceptDateList);
};

//TODO fix in interation 3 for url-handling module
formatUrl = function(url) {
    result = url.split(['//'])[1];
    result = result.split("").reverse().join("");
    result = result.split(['/'])[1];
    result = result.split("").reverse().join("");
    return result;
};

/* --------------- ------ Listener functions ------ ---------------*/

replaceListener = function() {
    chrome.webRequest.onBeforeRequest.removeListener(handleInterception);
    urlList = filterBlockedSitesOnChecked();
    if (urlList.length > 0) {
        addWebRequestListener(urlList);
    }
};

filterBlockedSitesOnChecked = function() {
    if(blockedSites.length > 0) {
        return blockedSites.filter(function (a) {return a.checkboxVal == true;});
    }
    return [];
};

addWebRequestListener = function(urlList) {
    chrome.webRequest.onBeforeRequest.addListener(
        handleInterception
        ,{
            urls: urlList.map(function (a) {return a.url;})
            ,types: ["main_frame"]
        }
        ,["blocking"]
    );
};

intercept = function(details) {
    incrementInterceptionCounter(details.url);
    addToInterceptDateList();
    setStorageOriginalDestination(details.url);
    setEnableInterceptionAfterTimeout(false, 2000);
    return {redirectUrl: redirectLink};
};

handleInterception = function(details) {
    if (interceptionEnabled) {
        return intercept(details);
    } else {
        setEnableInterceptionAfterTimeout(true, 1000);
    }
};

setEnableInterceptionAfterTimeout = function(val, time) {
    setTimeout(function () {
        interceptionEnabled = val;
    }, time);
};

/* --------------- ------ ------------------ ------ ---------------*/

addBrowserActionListener = function() {
    chrome.browserAction.onClicked.addListener(function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
            // since only one tab should be active and in the current window at once
            // the return variable should only have one entry
            var activeTab = arrayOfTabs[0];
            var activeTabUrl = activeTab.url;
            addToBlockedSites(activeTabUrl);

        });
    });
};

addSkipMessageListener = function() {
    chrome.runtime.onMessage.addListener(function(request, sender) {
        if (request.message == revertToOriginMessage) {
            chrome.tabs.update(sender.tab.id, {url: request.destination});
        }
    });
};
