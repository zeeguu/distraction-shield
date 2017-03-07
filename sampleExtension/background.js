
//Set that holds the urls to be intercepted
var blockedSites = null;

initExtension = function () {
    //First receive the blacklist from the sync storage, and then create a onBeforeRequest listener using this list.
    updateBlockedSites(addWebRequestListener);
 };

addWebRequestListener = function() {
    //remove any old listener that has an outdated set of blockedSites
    chrome.webRequest.onBeforeRequest.removeListener(intercept);
    if(blockedSites != null && blockedSites.length > 0){
        //Add listener that listens to webrequests and acts if the url is in the blockedSites
        chrome.webRequest.onBeforeRequest.addListener(
            intercept
            , { urls: blockedSites, types: ["main_frame"] }
            , ["blocking"]
        );
    }
};

// Something like a counter or something would be added here i think.
intercept = function() {
    //Target URL, RickRoll placeholder of course.
    return {redirectUrl: "https://zeeguu.herokuapp.com/get-ex"};
};

// This method receives the blacklist from the sync storage.
updateBlockedSites = function(callback){
    chrome.storage.sync.get("blacklist", function (items) {
        if (!chrome.runtime.error) {
            blockedSites = items.blacklist;
            return callback();
        }
    });
};




initExtension();








