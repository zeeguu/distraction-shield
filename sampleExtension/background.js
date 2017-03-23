
//Set that holds the urls to be intercepted
var blockedSites = [];
<<<<<<< HEAD
var interceptDateList = [];
var interceptCounter = 0;
=======
var doIntercept = true;


/*----------------------- Timer Mode vars -----------------------------------*/
var timer = 1 * Math.pow(10, 6); // 15 minutes timer
var interceptTime =  new Date().getTime();
>>>>>>> 1afdad5919a04694fc91802d1df301b37b1c10c9

/* --------------- ------ update list of BlockedSites ------ ---------------*/

updateStorage = function() {
    setStorageBlacklist(blockedSites);
    //setInterceptDateList(interceptDateList);
};

// This function receives the blacklist from the sync storage.
updateBlockedSites = function(callback){
    getStorageBlacklist(function(result) {
        blockedSites = result;
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
    var formattedUrl = formatUrl(urlToAdd);
    blockedSites.push(formattedUrl);
    updateStorage();
};

// This function adds the current time+date to the saved time+date list
addToInterceptDateList = function() {
    var newDate = new Date().toDateString();
    interceptDateList.push(newDate);
    setInterceptDateList(interceptDateList);
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

<<<<<<< HEAD

intercept = function() {
    addToInterceptDateList();
    incrementInterceptionCounter();
    return {redirectUrl: "https://zeeguu.herokuapp.com/get-ex"};
=======
intercept = function(details) {
    console.log("intercept is " + doIntercept);
    if (doIntercept) {
        console.log("details of intercept: ");//TODO remove
        //console.log("sending " + details.url + " to sync");//TODO remove
        storeCurrentPage(details.url);
        incrementInterceptionCounter(details.url);
        return {redirectUrl: redirectLink};
    }else{
        /* We do not redirect if the interception is made in the case
         * when we just want to go back to the original destination  */
        // asynchSetTrue();
        doIntercept = true;
        // console.log("intercept set to " + doIntercept);
    }
>>>>>>> 1afdad5919a04694fc91802d1df301b37b1c10c9
};

/* --------------------Store the current URL---------------------------------*/

storeCurrentPage = function (url) {
    // console.log("entered storeCurrentPage, received: " + url);//TODO remove
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
    console.log("message received");
    chrome.runtime.onMessage.addListener(function(request, sender) {
        if (request.message == "goToOriginalDestination") {
            doIntercept = false;
            console.log("intercept set to " + doIntercept + ", going to" + request.destination);
            chrome.tabs.update(sender.tab.id, {url: request.destination}, function() { console.log("now we are at the original destination");});
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








