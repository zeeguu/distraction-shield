
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;

var bg = chrome.extension.getBackgroundPage();

saveCurrentPageToBlacklist = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        var activeTab = arrayOfTabs[0];
        var activeTabUrl = activeTab.url;
        bg.addToBlockedSites(activeTabUrl);
        bg.replaceListener();
        console.log("test");
    });
};

redirectToStatistics = function() {
    chrome.tabs.create({'url': chrome.runtime.getURL('statisticsPage/statistics.html')});
    //return {redirectUrl: "://statisticsPage/statistics.html/"};
};

redirectToLogin = function() {
    chrome.tabs.create({'url': chrome.runtime.getURL('loginPage/login.html')});
    //return {redirectUrl: "://statisticsPage/statistics.html/"};
};

openOptionsPage = function() {
    chrome.runtime.openOptionsPage();
};

//Connect functions to HTML elements
connectButtons = function() {
    var saveButton = $('#saveBtn');
    saveButton.on('click', saveCurrentPageToBlacklist);
    var optionsButton = $('#optionsBtn');
    optionsButton.on('click', openOptionsPage);
    var statisticsButton = $('#statisticsBtn');
    statisticsButton.on('click', redirectToStatistics);
    var loginButton = $('#loginBtn');
    loginButton.on('click', redirectToLogin);
};

connectButtons();






