
// Log console messages to the background page console instead of the content page.
var bg = chrome.extension.getBackgroundPage();
var console = bg.console;
var ic = bg.ic;

var saveButton = $('#saveBtn');

var interceptionCounterTable = null;
var blacklistTable = null;
var dayStatisticsTable = null;


connectButton = function(html_button, method) {
    html_button.on('click', method);
};

saveCurrentPageToBlacklist = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        var activeTab = arrayOfTabs[0];
        var activeTabUrl = activeTab.url;
        bg.addToBlockedSites(activeTabUrl);
    });
};

//Initialize HTML elements and set the local variables
initStatisticsPage = function() {
    bg.statsStorage.getStatisticsData().then(function(response){
        let counters = ic.calcInterceptData(response.tds_interceptDateList);
        interceptionCounterTable.setDataAndRender(counters);
        blacklistTable.setDataAndRender(bg.blockedSites.getList());
    });
    bg.trs.getCompleteDayStatList().then(function(response){
        dayStatisticsTable.setDataAndRender(response);
    });
};

connectHtmlFunctionality = function() {
    interceptionCounterTable = new InterceptionCounterTable();
    blacklistTable = new BlacklistStatsTable($('#interceptTable'));
    dayStatisticsTable = new DayStatsTable($('#exerciseTime'));
    connectButton(saveButton, saveCurrentPageToBlacklist);
};


//Run this when the page is loaded.
document.addEventListener("DOMContentLoaded", function(){
    connectHtmlFunctionality();
    initStatisticsPage();
});

