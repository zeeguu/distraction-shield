
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;

var bg = chrome.extension.getBackgroundPage();

//Local variables that holds the list of links and interceptCounter.
var links = [];
var interceptionCounter = 0;
var interceptDateList = [];
var countDay = 0;
var countWeek = 0;
var countMonth = 0;

var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds


var html_table = $('#interceptTable');
var html_intCnt = $('#iCounter');
var html_countDay = $('#countDay');
var html_countWeek = $('#countWeek');
var html_countMonth = $('#countMonth');

saveCurrentPageToBlacklist = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        var activeTab = arrayOfTabs[0];
        var activeTabUrl = activeTab.url;
        bg.addToBlockedSites(activeTabUrl);
    });
};

//TODO Remove HTML from javascript for iteration 3.
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

createHtmlTable = function(){
    html_intCnt.text(interceptionCounter);
    html_countDay.text(countDay);
    html_countWeek.text(countWeek);
    html_countMonth.text(countMonth);
    $.each(links, function(k, site) {
        html_table.append(generateHtmlTableRow(site));
    });
};

//Initialize HTML elements and set the local variables
initStatisticsPage = function() {
    chrome.storage.sync.get(["tds_interceptCounter", "tds_interceptDateList"], function(output) {
        if (bg.handleRuntimeError()) {
            setLocalVariables(output);
            calcInterceptData();
            createHtmlTable();
        }
    });

    bg.trs.getCompleteDayStatList().then(function(response){
       setDayStatisticsHtml(response);
    });
};

appendHtmlItemTo = function(html_child, html_parent) {
    html_parent.append(html_child);
};

calcInterceptData = function() {
    var tmp = interceptDateList;
    if (tmp != null) {
        var firstDate = new Date();
        var length = tmp.length;
        for (var i = 0; i < length; i++) {
            incrementCounters(firstDate, new Date(tmp.pop());
        }
    }
};

incrementCounters = function(firstDate, secondDate){
    var diffDays = Math.floor(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
    if (diffDays == 0) {
        countDay++;
    }
    if (diffDays < 8) {
        countWeek++;
    }
    if (diffDays < 32) {
        countMonth++
    }
};

setLocalVariables = function(output) {
    interceptionCounter = output.tds_interceptCounter;
    interceptDateList = output.tds_interceptDateList;
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

