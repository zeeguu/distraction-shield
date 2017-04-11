
var bg = chrome.extension.getBackgroundPage();

var auth = bg.auth;

var saveButton = $('#saveBtn');
var sessionBtn = $('#sessionBtn');
var optionsButton = $('#optionsBtn');
var statisticsButton = $('#statisticsBtn');

saveCurrentPageToBlacklist = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        var activeTab = arrayOfTabs[0];
        bg.addUrlToBlockedSites(activeTab.url, setSaveButtonToSuccess);
    });
};

setSaveButtonToSuccess = function () {
    saveButton.attr('class', 'btn btn-success');
    saveButton.html('Successfully added!');
    setTimeout(function () {
        saveButton.attr('class', 'btn btn-info');
        saveButton.html(' Save current page ');
    }, 4000);
};

redirectToStatistics = function() {
    chrome.tabs.create({'url': chrome.runtime.getURL('statisticsPage/statistics.html')});
};

openOptionsPage = function() {
    chrome.tabs.create({'url': chrome.runtime.getURL('optionsPage/options.html')});
};

redirectToLogin = function() {
    chrome.tabs.create({'url': chrome.runtime.getURL('loginPage/login.html')});
};

logout = function () {
    auth.logout();
};

//Connect functions to HTML elements
connectButtons = function() {  
    saveButton.on('click', saveCurrentPageToBlacklist);
    optionsButton.on('click', openOptionsPage);
    statisticsButton.on('click', redirectToStatistics);
};

connectLogin = function () {
    sessionBtn.html('Login page');
    sessionBtn.off('click',  logout);
    sessionBtn.on('click', redirectToLogin);
};

connectLogout = function () {
    sessionBtn.html('Logout');
    sessionBtn.off('click',  redirectToLogin);
    sessionBtn.on('click', logout);
};

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
};

connectButtons();
checkLoginStatus();