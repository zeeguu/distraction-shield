
//Set that holds the urls to be intercepted
var blockedSites = [];

initExtension = function () {
    //First receive the blacklist from the sync storage, and then create a onBeforeRequest listener using this list.
    updateBlockedSites(replaceListener);
    addBrowserActionListener();
};

// This function receives the blacklist from the sync storage.
updateBlockedSites = function(callback){
    chrome.storage.sync.get("tds_blacklist", function (items) {
        if (!chrome.runtime.error) {
            blockedSites = items.tds_blacklist;
            return callback();
        }
    });
};

// This function adds one url to the blacklist
addToBlockedSites = function(urlToAdd) {
    var formatUrl = urlToAdd.split(['//'])[1];
    formatUrl = '*://' + formatUrl + '*';
    blockedSites.push(formatUrl);
    chrome.storage.sync.set({"tds_blacklist" : blockedSites }, function() {
        if(chrome.runtime.error) {
            console.log("Runtime error.");
        }
    });
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

intercept = function() {
    incrementInterceptionCounter();
    return {redirectUrl: "https://zeeguu.herokuapp.com/getex"};
    //return {redirectUrl: "https://zeeguu.herokuapp.com/getex"};
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

/* --------------- ------ Statistics functions ------ ---------------*/

incrementInterceptionCounter = function() {
    chrome.storage.sync.get("tds_interceptCounter", function(output) {
        var counter = output.tds_interceptCounter;
        counter++;
        chrome.storage.sync.set({"tds_interceptCounter": counter}, function () {
            if (chrome.runtime.error) {
                console.log("Runtime error.");
            }
        });
    });
};


/* --------------- ---- Run upon installation ---- ---------------*/

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.get("tds_blacklist", function(output) {
        if (output.tds_blacklist == null) {
            chrome.storage.sync.set({"tds_blacklist": []}, function () {
                if (chrome.runtime.error) {
                    console.log("Runtime error.");
                }
            });
        }
    });
    chrome.storage.sync.get("tds_interceptCounter", function(output) {
        if (output.tds_interceptCounter == null) {
            chrome.storage.sync.set({"tds_interceptCounter": 0}, function () {
                if (chrome.runtime.error) {
                    console.log("Runtime error.");
                }
            });
        }
    });
});

initExtension();








