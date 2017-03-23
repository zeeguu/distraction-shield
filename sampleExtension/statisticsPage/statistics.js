
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;

var bg = chrome.extension.getBackgroundPage();

//Local variables that holds the list of links and interceptCounter.
var links = [];
var interceptionCounter = 0;
var interceptDateList = [];
var date24 = 0;
var date7 = 0;
var date31 = 0;

var html_intCnt = $('#iCounter');

saveCurrentPageToBlacklist = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        var activeTab = arrayOfTabs[0];
        var activeTabUrl = activeTab.url;
        bg.addToBlockedSites(activeTabUrl);

    });
}

var saveButton = $('#saveBtn');



//Initialize HTML elements and set the local variables
initStatisticsPage = function() {
    chrome.storage.sync.get(["tds_blacklist", "tds_interceptCounter", "tds_interceptDateList"], function(output) {
        if (bg.handleRuntimeError()) {
            setLocalVariables(output);
            html_intCnt.text(interceptionCounter);
            calcInterceptData();
        }
    });
};

calcInterceptData = function() {
    var tmp = interceptDateList;
    if (tmp != null) {
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var firstDate = new Date();
        var length = tmp.length;

        for (var i = 0; i < length; i++) {
            var secondDate = new Date(tmp.pop());
            var diffDays = Math.floor(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
            if (diffDays == 0) {
                date24++;
            }
            if (diffDays < 8) {
                date7++;
            }
            if (diffDays < 32) {
                date31++
            }
        }
    }
};

setLocalVariables = function(output) {
    interceptionCounter = output.tds_interceptCounter;
    interceptDateList = output.tds_interceptDateList;
};

connectButtons = function(){
    saveButton.on('click', saveCurrentPageToBlacklist);
}

//Run this when the page is loaded.
document.addEventListener("DOMContentLoaded", function(){
    connectButtons();
    initStatisticsPage();
});