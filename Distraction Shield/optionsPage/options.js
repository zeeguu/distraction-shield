import * as storage from '../modules/storage'
import * as UserSettings    from '../classes/UserSettings'
import * as BlockedSiteList from '../classes/BlockedSiteList'
import * as synchronizer from '../modules/synchronizer'
import BlacklistTable from './classes/BlacklistTable'
import TurnOffSlider from './classes/TurnOffSlider'
import * as connectDataToHtml from './connectDataToHtml'
import * as htmlFunctionality from './htmlFunctionality'
import * as $ from "../dependencies/jquery/jquery-1.10.2";

/**
 * This file contains the core functions of the options page. this has all the local variables,
 * initializes everything javascript related and connects the syncStorage,
 * connectDataToHtml, blacklistTable and HtmlFunctionality
 * to one smoothly running file. Besides the initialization it contains the functions to manipulate the local variables
 * found here
 */
let html_txtFld = $('#textFld');
let html_intCnt = $('#iCounter');
let html_saveButton = $('#saveBtn');
let modeGroup = "modeOptions";

let blacklistTable;
let intervalSlider;
let turnOffSlider;
let tr = document.getElementById("tourRestart");

//Local variables that hold all necessary data.
let settings_object = new UserSettings();
let blacklist = new BlockedSiteList();
let interceptionCounter = 0;

/* -------------------- Initialization of options --------------------- */

//Initialize HTML elements and set the local variables
function initOptionsPage () {
    storage.getAll(function (output) {
        setLocalVariables(output);
        connectHtmlFunctionality();
        connectLocalDataToHtml();
    });
};

//Retrieve data from storage and store in local variables
function setLocalVariables (storage_output) {
    blacklist.addAllToList(storage_output.tds_blacklist);
    settings_object.copySettings(storage_output.tds_settings);
    interceptionCounter = storage_output.tds_interceptCounter;
};

// functionality from htmlFunctionality, blacklist_table and slider files
function connectHtmlFunctionality () {
    htmlFunctionality.initModeSelection(modeGroup, settings_object);
    intervalSlider = htmlFunctionality.initIntervalSlider(settings_object);
    blacklistTable = new BlacklistTable($('#blacklistTable'), syncBlockedSiteList);
    htmlFunctionality.connectButton(html_saveButton, htmlFunctionality.saveNewUrl);
    turnOffSlider = new TurnOffSlider.TurnOffSlider('#turnOff-slider', settings_object);
    htmlFunctionality.setKeyPressFunctions(html_txtFld, blacklistTable);
};

// functionality from connectDataToHtml file
function connectLocalDataToHtml () {
    connectDataToHtml.loadHtmlInterceptCounter(interceptionCounter, html_intCnt);
    connectDataToHtml.loadHtmlBlacklist(blacklist, blacklistTable);
    connectDataToHtml.loadHtmlMode(settings_object.mode, modeGroup);
    connectDataToHtml.loadHtmlInterval(settings_object.interceptionInterval, intervalSlider);
};

/* -------------------- Manipulate local variables ------------------- */

function removeFromLocalBlacklist (html_item) {
    let blockedSiteToDelete = html_item.data('blockedSite');
    return blacklist.removeFromList(blockedSiteToDelete);
};

function addToLocalBlacklist (blockedSite_item) {
    return blacklist.addToList(blockedSite_item);
};

function removeBlockedSiteFromAll (html_item) {
    if (removeFromLocalBlacklist(html_item)) {
        blacklistTable.removeFromTable(html_item);
        synchronizer.syncBlacklist(blacklist);
    }
};

function addBlockedSiteToAll (newItem) {
    if (addToLocalBlacklist(newItem)) {
        blacklistTable.addToTable(blacklistTable.generateTableRow(newItem));
        synchronizer.syncBlacklist(blacklist);
    }
};
/* -------------------- -------------------------- -------------------- */

function  syncBlockedSiteList () {
    synchronizer.syncBlacklist(blacklist);
};

//Run this when the page is loaded.
domReady(function () {
    initOptionsPage();
});

//Tour Restart Function
tr.onclick = function () {
    chrome.tabs.create({'url': chrome.runtime.getURL('introTour/introTour.html')});
};
