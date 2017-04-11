
// Log console messages to the background page console instead of the content page.
var bg = chrome.extension.getBackgroundPage();
var console = bg.console;
var saveButton = $('#saveBtn');

var interceptionCounterTable = null;
var blacklistTable = null;
var dayStatisticsTable = null;


connectButton = function(html_button, method) {
    html_button.on('click', method);
};

saveCurrentPageToBlacklist = function() {
    bg.tr.getCurrentTab().then(bg.addToBlockedSites(result));
};

//Initialize HTML elements and set the data in the tables.
initStatisticsPage = function() {
    Promise.all([bg.storage.getInterceptDateList(), bg.exerciseTime.getCompleteDayStatList()])
        .then(function(response){
            let counters = bg.ic.calcInterceptData(response[0].tds_interceptDateList);
            interceptionCounterTable.setDataAndRender(counters);
            blacklistTable.setDataAndRender(bg.blockedSites.getList());
            dayStatisticsTable.setDataAndRender(response[1]);
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

