/**
 * This file contains the core functions of the options page. this has all the local variables,
 * initializes everything javascript related and connects the syncStorage,
 * connectDataToHtml, blacklistTable and HtmlFunctionality
 * to one smoothly running file. Besides the initialization it contains the functions to manipulate the local variables
 * found here
 */

// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;

//Local variables that hold the html elements
var html_txtFld = $('#textFld');
var html_intCnt = $('#iCounter');
var html_saveButton = $('#saveBtn');
var html_deleteButton =$('#deleteBtn');
var modeGroup = "modeOptions";

//Local variables that hold all necessary data.
var blacklistTable;
var links = [];
var interceptionCounter = 0;
var mode = "";

/* -------------------- Initialization of options --------------------- */

//Initialize HTML elements and set the local variables
initOptionsPage = function() {
    chrome.storage.sync.get(["tds_blacklist", "tds_interceptCounter", "tds_mode"], function(output) {
        if (handleRuntimeError()) {
            setLocalVariables(output);
            connectHtmlFunctionality();
            connectLocalDataToHtml();
        }
    });
};

//Retrieve data from storage and store in local variables
setLocalVariables = function(storage_output) {
    links = storage_output.tds_blacklist;
    interceptionCounter = storage_output.tds_interceptCounter;
    mode = storage_output.tds_mode;
};

initBlacklistTable = function() {
    blacklistTable = new BlacklistTable($('#blacklistTable'));
    blacklistTable.initTable();
};

//initialize all html elements on this page
connectHtmlFunctionality = function() {
    initBlacklistTable();
    initModeSelection(modeGroup);
    connectButton(html_saveButton, saveNewUrl);
    setKeyPressFunctions();
};

//connect local data to html-elements
connectLocalDataToHtml = function() {
    loadHtmlInterceptCounter(interceptionCounter, html_intCnt);
    loadHtmlBlacklist(links, blacklistTable);
    loadHtmlMode(mode, modeGroup);
};


/* -------------------- Manipulate storage ------------------- */

updateStorageBlacklist = function() {
    setStorageBlacklistWithCallback(links, updateBackgroundPage);
};

/* -------------------- Manipulate background ------------------- */

updateBackgroundPage = function() {
    var bg = chrome.extension.getBackgroundPage();
    bg.retrieveBlockedSites(bg.replaceListener);
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
