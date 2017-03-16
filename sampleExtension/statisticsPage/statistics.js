
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;

var bg = chrome.extension.getBackgroundPage();

//Local variables that holds the list of links and interceptCounter.
var links = [];
var interceptionCounter = 0;

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
    chrome.storage.sync.get(["tds_blacklist", "tds_interceptCounter"], function(output) {
        if (bg.handleRuntimeError()) {
            setLocalVariables(output);
            html_intCnt.text(interceptionCounter);
        }
    });
};

setLocalVariables = function(output) {
    interceptionCounter = output.tds_interceptCounter;
};

connectButtons = function(){
    saveButton.on('click', saveCurrentPageToBlacklist);
}

//Run this when the page is loaded.
document.addEventListener("DOMContentLoaded", function(){
    connectButtons();
    initStatisticsPage();
});