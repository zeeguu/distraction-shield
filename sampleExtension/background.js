
//Set that holds the urls to be intercepted
var blockedSites = [];
var interceptDateList = [];
var interceptCounter = 0;
var doIntercept = true;


/*----------------------- Timer Mode vars -----------------------------------*/
var timer = Math.pow(10, 6); // 15 minutes timer
var interceptTime =  new Date().getTime();

/* --------------- ------ update list of BlockedSites ------ ---------------*/

updateStorage = function() {
    setStorageBlacklist(blockedSites);
    return {redirectUrl: "https://zeeguu.herokuapp.com/get-ex"};
};

// This function receives the blacklist from the sync storage.
updateBlockedSites = function(callback){
    getStorageBlacklist(function(blacklist) {
        blockedSites = blacklist;
        return callback();
    });
};

//Loads the intercept time+date list from storage
updateInterceptDateList = function() {
    getInterceptDateList(function(dateList) {
        interceptDateList = dateList;
    });
};

//Loads the intercept counter from storage
updateInterceptCounter = function(callback) {
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
        incrementInterceptionCounter(details.url);
        addToInterceptDateList();
        storeCurrentPage(details.url);
        asynchSetDoIntercept(false, 2000);
        return {redirectUrl: redirectLink};
    }else{
        /* We do not redirect if the interception is made in the case
         * when we just want to go back to the original destination
         * At this point different modes (timeouts etc) will be
         * (in part) implemented */
        asynchSetDoIntercept(true, (900000));
    }
};

function asynchSetDoIntercept(val, time) {
    setTimeout(function () {
        doIntercept = val;
    }, time);
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
            chrome.tabs.update(sender.tab.id, {url: request.destination});
        }
    });
};







