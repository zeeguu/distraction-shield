
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;

var bg = chrome.extension.getBackgroundPage();

var auth = bg.auth;

var saveButton = $('#saveBtn');

saveCurrentPageToBlacklist = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        var activeTab = arrayOfTabs[0];
        bg.addUrlToBlockedSites(activeTab.url, setSaveButtonToSuccess);

       // window.close();
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
    auth.logout().then(function () {
        updateSessionbutton();
    }, function () {
        updateSessionbutton();
    });
};

//Connect functions to HTML elements
connectButtons = function() {  
    saveButton.on('click', saveCurrentPageToBlacklist);
    var optionsButton = $('#optionsBtn');
    optionsButton.on('click', openOptionsPage);
    var statisticsButton = $('#statisticsBtn');
    statisticsButton.on('click', redirectToStatistics);
};

connectLogin = function () {
    var sessionBtn =$('#sessionBtn');
    sessionBtn.html('Login page');
    sessionBtn.off('click',  logout);
    sessionBtn.on('click', redirectToLogin);
};

connectLogout = function () {
    var sessionBtn =$('#sessionBtn');
    sessionBtn.html('Logout');
    sessionBtn.off('click',  redirectToLogin);
    sessionBtn.on('click', logout);
};

updateSessionbutton = function() {
    console.log('updateSessionButton()');
    if (auth.sessionAuthentic) {
        //logout button active
        console.log('session authenticated, so logout');
        connectLogout();
    } else {
        //login button active
        console.log('session not authenticated, so login');
        connectLogin();
    }
}

checkLoginStatus = function () {
    console.log('checkLoginStatus()');
    auth.authenticateSession().then( function () {
        updateSessionbutton();
    }, function () {
        updateSessionbutton();
    })
};

connectButtons();
checkLoginStatus();