
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;

var bg = chrome.extension.getBackgroundPage();

var auth = bg.auth;

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

logout = function () {
    auth.logout();
}

openOptionsPage = function() {
    // chrome.runtime.openOptionsPage();
    chrome.tabs.create({'url': chrome.runtime.getURL('optionsPage/options.html')});
};

//Connect functions to HTML elements
connectButtons = function() {
    var saveButton = $('#saveBtn');
    saveButton.on('click', saveCurrentPageToBlacklist);
    var optionsButton = $('#optionsBtn');
    optionsButton.on('click', openOptionsPage);
    var statisticsButton = $('#statisticsBtn');
    statisticsButton.on('click', redirectToStatistics);
};

connectLogin = function () {
    console.log('connectLogin');
    $('#sessionBtn').html('Login page');
    $('#sessionBtn').off('click',  logout);
    $('#sessionBtn').on('click', redirectToLogin);
}

connectLogout = function () {
    console.log('connectLogout');
    $('#sessionBtn').html('Logout');
    $('#sessionBtn').off('click',  redirectToLogin);
    $('#sessionBtn').on('click', logout);
}

checkLoginStatus = function () {
    auth.checkSessionAuthenticity().then( function () {
        if (auth.sessionAuthenticated) {
            //logout button active
            connectLogout();
        } else {
            //login button active
            connectLogin();
        }
    }, function () {
        //login button active
        connectLogin();
    })
}

// $('body').on('load', checkLoginStatus);

connectButtons();
checkLoginStatus();