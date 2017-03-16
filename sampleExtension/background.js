
//Set that holds the urls to be intercepted
var blockedSites = [];

/* --------------- ------ update list of BlockedSites ------ ---------------*/

updateStorage = function() {
    setStorageBlacklist(blockedSites);
};

// This function receives the blacklist from the sync storage.
updateBlockedSites = function(callback){
    getStorageBlacklist(function(result) {
        blockedSites = result;
        return callback();
    });
};

// This function adds one url to the blacklist
addToBlockedSites = function(urlToAdd) {
    var formattedUrl = formatUrl(urlToAdd);
    blockedSites.push(formattedUrl);
    updateStorage();
};

formatUrl = function(url) {
    result = url.split(['//'])[1];
    result = result.split("").reverse().join("");
    result = result.split(['/'])[1];
    result = result.split("").reverse().join("");
    return '*://' + result + '/*';
};

/* --------------- ------ Listener functions ------ ---------------*/

replaceListener = function() {
    chrome.webRequest.onBeforeRequest.removeListener(intercept);
    addWebRequestListener();
};

addWebRequestListener = function() {
    if(blockedSites != null && blockedSites.length > 0) {
        chrome.webRequest.onBeforeRequest.addListener(
            intercept,
            {
                //Url's to be intercepted
                urls: blockedSites,
                types: ["main_frame"]
            },
            ["blocking"]
        );
    }
};

intercept = function(details) {
    incrementInterceptionCounter();
    storeCurrentPage(details.url);

    return {redirectUrl: redirectLink};
};
/* ------------Store the current URL-------- ------ ---------------*/

storeCurrentPage = function (url) {
   chrome.storage.sync.set({"reredirecturl" : url}, function() {
       handleRuntimeError();
   });
}

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











