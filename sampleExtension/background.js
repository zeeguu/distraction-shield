
//Set that holds the urls to be intercepted
var blockedSites = [];
var doIntercept = true;


/*----------------------- Timer Mode vars -----------------------------------*/
var timer = 1 * Math.pow(10, 6); // 15 minutes timer
var interceptTime =  new Date().getTime();


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
    var urlList = blockedSites.filter(function (a) {return a.checkboxVal == true;});

    if(blockedSites != null && blockedSites.length > 0 && urlList.length > 0) {
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
};

intercept = function(details) {
    if (doIntercept) {
        console.log("details of intercept: ");//TODO remove
        console.log(JSON.stringify(details,null,4));//TODO remove
        incrementInterceptionCounter();
        console.log("sending " + details.url + " to sync");//TODO remove
        storeCurrentPage(details.url);
        return {redirectUrl: redirectLink};
    }else{
        /* We do not redirect if the interception is made in the case
         * when we just want to go back to the original destination  */
        doIntercept = true;
    }
};
/* --------------------Store the current URL---------------------------------*/

storeCurrentPage = function (url) {
    console.log("entered storeCurrentPage, received: " + url);//TODO remove
   chrome.storage.sync.set({"originalDestination" : url}, function(url) {
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

addSkipMessageListener = function() {
    chrome.runtime.onMessage.addListener(function(request, sender) {
        if (request.message == "goToOriginalDestination") {
            doIntercept = false;
            chrome.tabs.update(sender.tab.id, {url: request.destination});
        }
    });
};

/*-----------------------Compute time elapsed----------------------------------*/

isInterceptionTime = function () {
    var currentTime = new Date();
    if(currentTime - timer < interceptTime){
        return true;
    }
    console.log("cT - timer : ");
    console.log( currentTime - timer);
    console.log("interceptTime : ");
    console.log(interceptTime);
    return false;
};








