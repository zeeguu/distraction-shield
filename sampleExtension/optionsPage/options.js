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
var modeGroup = "modeOptions";

var blacklistTable;
var intervalSlider;
var turnOffSlider;

//Local variables that hold all necessary data.
var settings_object = new UserSettings();
var blacklist = new BlockedSiteList();
var interceptionCounter = 0;

/* -------------------- Initialization of options --------------------- */

//Initialize HTML elements and set the local variables
initOptionsPage = function() {
    storage.getAll(function(output) {
        setLocalVariables(output);
        connectHtmlFunctionality();
        connectLocalDataToHtml();
    });
};

//Retrieve data from storage and store in local variables
setLocalVariables = function(storage_output) {
    blacklist.addAllToList(storage_output.tds_blacklist);
    settings_object.copySettings(storage_output.tds_settings);
    interceptionCounter = storage_output.tds_interceptCounter;
};

// functionality from htmlFunctionality, blacklist_table and slider file
connectHtmlFunctionality = function() {
    blacklistTable = new BlacklistTable($('#blacklistTable'));
    turnOffSlider = new TurnOffSlider('#turnOff-slider-div');
    initIntervalSlider();
    initModeSelection(modeGroup);
    connectButton(html_saveButton, saveNewUrl);
    setKeyPressFunctions();
};

// functionality from connectDataToHtml file
connectLocalDataToHtml = function() {
    loadHtmlInterceptCounter(interceptionCounter, html_intCnt);
    loadHtmlBlacklist(blacklist, blacklistTable);
    loadHtmlMode(settings_object.getMode(), modeGroup);
    loadHtmlInterval(settings_object.getInterceptionInterval(), intervalSlider);
};

/* -------------------- Manipulate local variables ------------------- */

removeFromLocalBlacklist = function(html_item) {
    var blockedSiteToDelete = html_item.data('blockedSite');
    blacklist.removeFromList(blockedSiteToDelete);
};

addToLocalBlacklist = function(blockedSite_item) {
    return blacklist.addToList(blockedSite_item);
};

/* -------------------- -------------------------- -------------------- */

//Run this when the page is loaded.
document.addEventListener("DOMContentLoaded", function() {
    initOptionsPage();
});
