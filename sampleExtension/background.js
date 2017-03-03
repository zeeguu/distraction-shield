// Called when the user clicks on the extension icon.
chrome.browserAction.onClicked.addListener(function(tab) {
  
});

chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, updatedTab) {
	if (changeInfo.url) {
		console.log(updatedTab.url);
	}
});


//Function that intercepts incoming url requests and redirects them if they match any 
//of the specified URL's 
chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		//Target URL, RickRoll placeholder of course
        //alert("I am an alert box!");
		//  here insert iframe script is going to be run
		return {redirectUrl: "https://zeeguu.unibe.ch/"};
	},
	{
		//Url's to be intercepted
		urls: [
			"*://www.facebook.com/*",
			"*://twitter.com/*",
			"*://www.instagram.com/*",
//			"*://www.youtube.com/*",
			"*://9gag.com/*",
			"*://9gag.tv/*",
			"*://www.twitch.tv/*",
			"*://www.reddit.com/*"
		],
		//Copied this from somewhere, ought to do some research in to what it stands for
		//I guess these are the kind of things where we can filter on logging in to facebook 
		//should be redirected or not
		types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
	},
	["blocking"]
);

