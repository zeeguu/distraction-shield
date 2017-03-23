
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;

var bg = chrome.extension.getBackgroundPage();

//Local variables that holds the list of links and interceptCounter.
var links = [];
var interceptionCounter = 0;

var html_table = $('#interceptTable');
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

generateHtmlTableRow = function(site) {
    var row =
        $("<tr class='table-row' >" +
            "<td>"+site.icon+"</td>" +
            "<td>"+site.name+"</td>" +
            "<td>"+site.counter+"</td>" +
        "</tr>");
    //add the actual object to the html_element
    row.data('site', site);
    return row;
};

var saveButton = $('#saveBtn');

createHtmlTable = function (){
    html_intCnt.text(interceptionCounter);
    console.log (interceptionCounter);
    console.log (html_intCnt);
    $.each(links, function(k, site) {
        html_table.append(generateHtmlTableRow(site));
    });
}

//Initialize HTML elements and set the local variables
initStatisticsPage = function() {
    chrome.storage.sync.get(["tds_interceptCounter"], function(output) {
        if (bg.handleRuntimeError()) {
            setLocalVariables(output);
            createHtmlTable();
        }
    });

    bg.TrackerStorage.getCompleteDayStatList().then(function(response){
       setDayStatisticsHtml(response);
    });
};

appendHtmlItemTo = function(html_child, html_parent) {
    html_parent.append(html_child);
};

setLocalVariables = function(output) {
    interceptionCounter = output.tds_interceptCounter;
    links = bg.blockedSites;
};

connectButtons = function(){
    saveButton.on('click', saveCurrentPageToBlacklist);
};

generateDayStatisticHtmlRow = function(dayStatistic) {
    var tableRow =
        $("<tr>" +
            "<td>"+dayStatistic.date+"</td>" +
            "<td>"+dayStatistic.timespent+"</td>" +
            "</tr>");
    //add the actual object to the html_element
    return tableRow;
};

setDayStatisticsHtml = function(list) {
    list = list.reverse();
    $.each(list, function(key, value) {
        if(value != null){
            appendHtmlItemTo(generateDayStatisticHtmlRow(value), $('#exerciseTime'));
        }
    });
};

//Run this when the page is loaded.
document.addEventListener("DOMContentLoaded", function(){
    connectButtons();
    initStatisticsPage();
});

