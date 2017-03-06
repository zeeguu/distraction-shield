
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;

function Background () {
	this.blockedSites =  null;

	this.init = function () {
        //First receive the blacklist from the sync storage, and then create a onBeforeRequest listener using this list.
        this.retrieveBlacklist(this.addWebRequestListener);

        // Called when the user clicks on the extension icon.
        chrome.browserAction.onClicked.addListener(function(tab) {
            // Shortcut to reload the extension.
            chrome.runtime.reload();
        });
     },

    this.test = function() {
        console.log("We called this function from blacklist!");
    },

    this.addWebRequestListener = function() {
        if(background.blockedSites != null && background.blockedSites.length > 0){
            // Function that intercepts incoming url requests and redirects them if they match any
            // of the blacklist URL's
            chrome.webRequest.onBeforeRequest.removeListener(background.intercept);
            chrome.webRequest.onBeforeRequest.addListener(
                background.intercept, 
                {
                    //Url's to be intercepted
                    urls: background.blockedSites,
                    types: ["main_frame"]
                },
                    ["blocking"]
            );
        }
                
    },

    // This method receives the blacklist from the sync storage.
    this.retrieveBlacklist = function(callback){
        chrome.storage.sync.get("blacklist", function (items) {
            if (!chrome.runtime.error) {
                background.blockedSites = items.blacklist;
                return callback();
            }
        });
    },	

    // Something like a counter or something would be added here i think.
    this.intercept = function() {
        //Target URL, RickRoll placeholder of course.
        return {redirectUrl: "https://zeeguu.herokuapp.com/get-ex"};
    }

};

var background = new Background();
background.init();








