
//Set that holds the urls to be intercepted
var blockedSites = [];
var doIntercept = true;


/*----------------------- Timer Mode vars -----------------------------------*/
var timer = Math.pow(10, 6); // 15 minutes timer
var interceptTime =  new Date().getTime();


/* --------------- ------ update list of BlockedSites ------ ---------------*/

updateStorage = function() {
    setStorageBlacklist(blockedSites);
};

// This function receives the blacklist from the sync storage.
updateBlockedSites = function(callback){
    getStorageBlacklist(function(blacklist) {
        blockedSites = blacklist;
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

formatUrl = function(url) {
    result = url.split(['//'])[1];
    result = result.split("").reverse().join("");
    result = result.split(['/'])[1];
    result = result.split("").reverse().join("");
    return result;
};

/* --------------- ------ Listener functions ------ ---------------*/

replaceListener = function() {
    chrome.webRequest.onBeforeRequest.removeListener(intercept);
    addWebRequestListener();
};

addWebRequestListener = function() {
    if(blockedSites.length > 0) {
        var urlList = blockedSites.filter(function (a) {return a.checkboxVal == true;});
        if (urlList.length > 0) {
            chrome.webRequest.onBeforeRequest.addListener(
                intercept
                ,{
                    //Url's to be intercepted
                    urls: urlList.map(function (a) {return a.url;})
                    ,types: ["main_frame"]
                }
                ,["blocking"]
            );
        }
    }
};

intercept = function(details) {
    if (doIntercept) {
        incrementInterceptionCounter();
        storeCurrentPage(details.url);
        asynchSetDoIntercept(false);
        return {redirectUrl: redirectLink};
    }else{
        /* We do not redirect if the interception is made in the case
         * when we just want to go back to the original destination
         * At this point different modes (timeouts etc) will be
         * (in part) implemented */
        asynchSetDoIntercept(true);
    }
};

function asynchSetDoIntercept(val) {
    setTimeout(function () {
        doIntercept = val;
    }, 2000);
}

/* --------------------Store the current URL---------------------------------*/

storeCurrentPage = function (url) {
   chrome.storage.sync.set({"originalDestination" : url}, function() {
       handleRuntimeError();
   });
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
        if (request.message == "goToOriginalDestination") {
            console.log("intercept set to " + doIntercept + ", going to" + request.destination);
            chrome.tabs.update(sender.tab.id, {url: request.destination});
        }
    });
};








