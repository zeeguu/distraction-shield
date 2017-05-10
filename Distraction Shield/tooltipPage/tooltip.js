require.config({
    baseUrl: "./",
    paths : {
        'BlockedSite'               : '../classes/BlockedSite',
        'BlockedSiteList'           : '../classes/BlockedSiteList',
        'UserSettings'              : '../classes/UserSettings',
        'exerciseTime'              : '../modules/statistics/exerciseTime',
        'interception'              : '../modules/statistics/interception',
        'tracker'                   : '../modules/statistics/tracker',
        'blockedSiteBuilder'        : '../modules/blockedSiteBuilder',
        'dateutil'                  : '../modules/dateutil',
        'storage'                   : '../modules/storage',
        'synchronizer'              : '../modules/synchronizer',
        'urlFormatter'              : '../modules/urlFormatter',
        'background'                : '../background',
        'constants'                 : '../constants',
        'BlacklistStatsTable'       : '../statisticsPage/classes/BlacklistStatsTable',
        'ExerciseTimeTable'         : '../statisticsPage/classes/ExerciseTimeTable',
        'InterceptionCounterTable'  : '../statisticsPage/classes/InterceptionCounterTable',
        'jquery'                    : '../dependencies/jquery/jquery-1.10.2',
        'domReady'                  : '../domReady'

    }
});

require(['jquery'], function($) {
    var saveButton = $('#saveBtn');
    var optionsButton = $('#optionsBtn');
    var statisticsButton = $('#statisticsBtn');

    saveCurrentPageToBlacklist = function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
            var activeTab = arrayOfTabs[0];
            chrome.runtime.sendMessage({message : "newUrl", unformattedUrl : activeTab.url}, setSaveButtonToSuccess());
        });
    };

    setSaveButtonToSuccess = function () {
        saveButton.attr('class', 'btn btn-success');
        saveButton.html('Successfully added!');
        setTimeout(function () {
            saveButton.attr('class', 'btn btn-info');
            saveButton.html('Block');
        }, 4000);
    };

    redirectToStatistics = function () {
        chrome.tabs.create({'url': chrome.runtime.getURL('statisticsPage/statistics.html')});
    };

    openOptionsPage = function () {
        chrome.tabs.create({'url': chrome.runtime.getURL('optionsPage/options.html')});
    };


//Connect functions to HTML elements
    connectButtons = function () {
        saveButton.on('click', saveCurrentPageToBlacklist);
        optionsButton.on('click', openOptionsPage);
        statisticsButton.on('click', redirectToStatistics);
    };


    connectButtons();
});

