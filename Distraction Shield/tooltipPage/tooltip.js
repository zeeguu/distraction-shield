require.config({
    baseUrl: "./",
    paths : {
        'BlockedSite'       : '../classes/BlockedSite',
        'BlockedSiteList'   : '../classes/BlockedSiteList',
        'UserSettings'      : '../classes/UserSettings',
        'api'               : '../modules/authentication/api',
        'auth'              : '../modules/authentication/auth',
        'exerciseTime'      : '../modules/statistics/exerciseTime',
        'interception'      : '../modules/statistics/interception',
        'tracker'           : '../modules/statistics/tracker',
        'blockedSiteBuilder': '../modules/blockedSiteBuilder',
        'dateutil'          : '../modules/dateutil',
        'storage'           : '../modules/storage',
        'synchronizer'      : '../modules/synchronizer',
        'urlFormatter'      : '../modules/urlFormatter',
        'constants'         : '../constants',
        'jquery'            : '../dependencies/jquery/jquery-1.10.2',
        'background'        : '../background'

    }
});

require(['background','auth','jquery'], function(background, authm,$) {
    // var bg = chrome.extension.getBackgroundPage();

    var auth = new authm.Auth();

    var saveButton = $('#saveBtn');
    var sessionBtn = $('#sessionBtn');
    var optionsButton = $('#optionsBtn');
    var statisticsButton = $('#statisticsBtn');

    saveCurrentPageToBlacklist = function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
            var activeTab = arrayOfTabs[0];
            console.log('sending activeTab.url: ' + activeTab.url); //todo remove
            // background.addUrlToBlockedSites(activeTab.url, setSaveButtonToSuccess);
            chrome.runtime.sendMessage({title : "newUrl", unformattedUrl : activeTab.url}, setSaveButtonToSuccess());
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

    redirectToStatistics = function () {
        chrome.tabs.create({'url': chrome.runtime.getURL('statisticsPage/statistics.html')});
    };

    openOptionsPage = function () {
        chrome.tabs.create({'url': chrome.runtime.getURL('optionsPage/options.html')});
    };

    redirectToLogin = function () {
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
    connectButtons = function () {
        saveButton.on('click', saveCurrentPageToBlacklist);
        optionsButton.on('click', openOptionsPage);
        statisticsButton.on('click', redirectToStatistics);
    };

    connectLogin = function () {
        sessionBtn.html('Login page');
        sessionBtn.off('click', logout);
        sessionBtn.on('click', redirectToLogin);
    };

    connectLogout = function () {
        sessionBtn.html('Logout');
        sessionBtn.off('click', redirectToLogin);
        sessionBtn.on('click', logout);
    };

    updateSessionbutton = function () {
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
        }, function () {
            updateSessionbutton();
        })
    };

    connectButtons();
    checkLoginStatus();
});
