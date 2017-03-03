
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;

var background = {
	blockedSites: null,

	init: function (){

		// Called when the user clicks on the extension icon.
		chrome.browserAction.onClicked.addListener(function(tab) {

            // Shortcut to reload the extension.
			chrome.runtime.reload();

			// chrome.tabs.create({"url": "//popup.html"});
		});

		chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, updatedTab) {
			if (changeInfo.url) {
				console.log(updatedTab.url);
			}
		});


        //First receive the blacklist from the local storage, and then create a onBeforeRequest listener with this list.

        this.retrieveBlacklist(function(){
            if(background.blockedSites != null){

                // Function that intercepts incoming url requests and redirects them if they match any
                // of the blacklist URL's
                chrome.webRequest.onBeforeRequest.addListener(
                    function(details) {
                        // Whenever one of the URLs matches, call the intercept method.
                        return background["intercept"]();
                    },
                    {
                        //Url's to be intercepted
                        urls: background.blockedSites,

                        //Copied this from somewhere, ought to do some research in to what it stands for
                        //I guess these are the kind of things where we can filter on logging in to facebook
                        //should be redirected or not
                        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
                    },
                    ["blocking"]
                );
            }
        });
	},

    // This method receives the blacklist from the local storage.
    retrieveBlacklist: function(callback){
        chrome.storage.local.get("blacklist", function (items) {
            if (!chrome.runtime.error) {
                background.blockedSites = items.blacklist;
                return callback();
            }
        });

    },

    intercept: function(){
        //Target URL, RickRoll placeholder of course
        return {redirectUrl: "https://www.google.com"};
    }

};

background.init();




