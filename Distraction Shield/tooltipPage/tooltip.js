
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
    auth.logout().then(function () {
        updateSessionbutton();
    });
};

//Connect functions to HTML elements
connectButtons = function() {
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

updateSessionbutton = function() {
    if (auth.sessionAuthentic) {
        //logout button active
        connectLogout();
    } else {
        //login button active
        connectLogin();
    }
};

checkLoginStatus = function () {
    auth.authenticateSession().then(function () {
        updateSessionbutton();
    });
};

patternMatchUrl = function(url) {
    var list = bg.blockedSites.getList();
    var item;
    list.some(function(bl) {
        if(stringutil.wildcardStrComp(url, bl.getUrl())) {
            item = bl;
            return true;
        }
        return false;
    });
    return item;
};

toggleBlockedSite = function(url) {
    return function() {
        var list = bg.blockedSites;
        var newItem;
        for (var i = 0; i < list.getList().length; i++) {
            if (stringutil.wildcardStrComp(url, list.getList()[i].getUrl())) {
                newItem = list.getList()[i];
                break;
            }
        }
        newItem.setCheckboxVal(!newItem.getCheckboxVal());
        if (newItem.getCheckboxVal()) {
            saveButton.text("Disable blocking this page");
        } else {
            saveButton.text("Enable blocking this page");
        }
        synchronizer.syncBlacklist(list);
    }
};

setSaveButtonFunctionality = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        var activeTab = arrayOfTabs[0];
        var url = activeTab.url;
        var matchedBlockedSite = patternMatchUrl(url);
        if (matchedBlockedSite != null) {
            saveButton.on('click', toggleBlockedSite(url));
            if(matchedBlockedSite.getCheckboxVal()) {
                saveButton.text("Disable blocking this page");
            } else {
                saveButton.text("Enable blocking this page");
            }
        } else {
            saveButton.on('click', saveCurrentPageToBlacklist);
            saveButton.text("Save current page");
        }
    });
};

connectButtons();
checkLoginStatus();
setSaveButtonFunctionality();
