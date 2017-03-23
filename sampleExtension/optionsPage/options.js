/**
 * This file contains the core functions of the options page. this has the local variables,
 * initializes everything javascript related and connects the syncStorage, connectDataToHtml and HtmlFunctionality
 * to oe smoothly running file. Besides the initialization it contains the functions to manipulate the local variables
 * found here
 */

// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;

//Local variables that holds the list of links and interceptCoun and variables ter.
var links = [];
var interceptionCounter = 0;
var mode = "";

/* -------------------- Initialization of options --------------------- */

//Initialize HTML elements and set the local variables
initOptionsPage = function() {
    chrome.storage.sync.get(["tds_blacklist", "tds_interceptCounter", "tds_mode"], function(output) {
        if (handleRuntimeError()) {
            setLocalVariables(output);
            connectLocalDataToHtml(); /* bottom of connectDataToHtml.js */
            connectHtmlFunctionality(); /* bottom of htmlFunctionality.js */
        }
    });
};

setLocalVariables = function(storage_output) {
    links = storage_output.tds_blacklist;
    interceptionCounter = storage_output.tds_interceptCounter;
    mode = storage_output.tds_mode;
};

/* -------------------- Manipulate storage ------------------- */

updateStorageBlacklist = function() {
    setStorageBlacklistWithCallback(links, updateBackgroundPage);
};

/* -------------------- Manipulate background ------------------- */

updateBackgroundPage = function() {
    var bg = chrome.extension.getBackgroundPage();
    bg.updateBlockedSites(bg.replaceListener);
};

/* -------------------- Manipulate local variables ------------------- */

removeFromLocalLinks = function(html_item) {
    var urlkey = links.indexOf(html_item.data('blockedSite'));
    links.splice(urlkey, 1);
};

addToLocalLinks = function(blockedSite_item) {
    links.push(blockedSite_item);
};

/* -------------------- -------------------------- -------------------- */

//Run this when the page is loaded.
document.addEventListener("DOMContentLoaded", function(){
    initOptionsPage();
});


/* -------------------- ---------- WIP ---------- -------------------- */

// still work in progress, might be possible in combination with url checker
getHtmlInfo = function (url) {
    $.get(url, logData);
};

logData = function (data) {
    var title = data.match("<title>(.*?)</title>")[1];
    console.log(title);
};
