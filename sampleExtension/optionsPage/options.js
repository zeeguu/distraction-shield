/**
 * This file contains the core functions of the options page. this has all the local variables,
 * initializes everything javascript related and connects the syncStorage,
 * connectDataToHtml, blacklistTable and HtmlFunctionality
 * to one smoothly running file. Besides the initialization it contains the functions to manipulate the local variables
 * found here
 */

// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;
var url_formatter = new Url_Formatter();

//Local variables that hold the html elements
var html_txtFld = $('#textFld');
var html_intCnt = $('#iCounter');
var html_saveButton = $('#saveBtn');
var modeGroup = "modeOptions";

var blacklistTable;

//Local variables that hold all necessary data.
var settings_object = {};
var links = [];
var interceptionCounter = 0;

/* -------------------- Initialization of options --------------------- */

//Initialize HTML elements and set the local variables
initOptionsPage = function() {
    getStorageAll( function(output) {
        setLocalVariables(output);
        connectHtmlFunctionality();
        connectLocalDataToHtml();
    });
};

//Retrieve data from storage and store in local variables
setLocalVariables = function(storage_output) {
    links = storage_output.tds_blacklist;
    interceptionCounter = storage_output.tds_interceptCounter;
    mode = storage_output.tds_mode;
    settings_object = storage_output.tds_settings;
};

initBlacklistTable = function() {
    blacklistTable = new BlacklistTable($('#blacklistTable'));
    blacklistTable.initTable();
};

// functionality from htmlFunctionality and blacklist_table file
connectHtmlFunctionality = function() {
    initBlacklistTable();
    initModeSelection(modeGroup);
    connectButton(html_saveButton, saveNewUrl);
    setKeyPressFunctions();
};

// functionality from connectDataToHtml file
connectLocalDataToHtml = function() {
    loadHtmlInterceptCounter(interceptionCounter, html_intCnt);
    loadHtmlBlacklist(links, blacklistTable);
    loadHtmlMode(settings_object.mode, modeGroup);
};


/* -------------------- Manipulate storage ------------------- */

updateStorageBlacklist = function() {
    setStorageBlacklistWithCallback(links, updateBackgroundPage);
};

updateStorageSettings = function() {
    setStorageSettings(settings_object);
};


/* -------------------- Manipulate background ------------------- */

updateBackgroundPage = function() {
    var bg = chrome.extension.getBackgroundPage();
    bg.retrieveBlockedSites(replaceListener);
};

setBackgroundSettings = function() {
    var bg = chrome.extension.getBackgroundPage();
    bg.setLocalSettings(settings_object);
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
