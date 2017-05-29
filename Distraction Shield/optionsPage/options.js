import * as storage from '../modules/storage'
import UserSettings from '../classes/UserSettings'
import BlockedSiteList from '../classes/BlockedSiteList'
import * as synchronizer from '../modules/synchronizer'
import BlacklistTable from './classes/BlacklistTable'
import TurnOffSlider from './classes/TurnOffSlider'
import * as connectDataToHtml from './connectDataToHtml'
import * as htmlFunctionality from './htmlFunctionality'
import * as blockedSiteBuilder from '../modules/blockedSiteBuilder'
import {feedbackLink} from '../constants'
import {openTabSingleton} from '../modules/tabutil'

/**
 * This file contains the core functions of the options page. this has all the local variables,
 * initializes everything javascript related and connects the syncStorage,
 * connectDataToHtml, blacklistTable and HtmlFunctionality
 * to one smoothly running file. Besides the initialization it contains the functions to manipulate the local variables
 * found here
 */
let modeGroup = "modeOptions";

<<<<<<< HEAD
let blacklistTable;
let intervalSlider;
let turnOffSlider;
=======
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;
var localSettings = chrome.extension.getBackgroundPage().localSettings;

//Local variables that hold the html elements
var html_txtFld = $('#textFld');
var html_intCnt = $('#iCounter');
var html_saveButton = $('#saveBtn');
var modeGroup = "modeOptions";


var blacklistTable;
var intervalSlider;
var turnOffSlider;
var tr = document.getElementById("tourRestart");
var feedback = document.getElementById("feedback");
>>>>>>> development

//Local variables that hold all necessary data.
let settings_object = new UserSettings();
let blacklist = new BlockedSiteList();
let interceptionCounter = 0;

/* -------------------- Initialization of options --------------------- */

//Initialize HTML elements and set the local variables
function initOptionsPage() {
    storage.getAll(function (output) {
        setLocalVariables(output);
        connectHtmlFunctionality();
        connectLocalDataToHtml();
    });
}
//Retrieve data from storage and store in local variables
function setLocalVariables(storage_output) {
    blacklist.addAllToList(storage_output.tds_blacklist);
    settings_object.copySettings(storage_output.tds_settings);
    interceptionCounter = storage_output.tds_interceptCounter;
}
// functionality from htmlFunctionality, blacklist_table and slider files
function connectHtmlFunctionality() {
    htmlFunctionality.initModeSelection(modeGroup, settings_object);
    intervalSlider = htmlFunctionality.initIntervalSlider(settings_object);
    blacklistTable = new BlacklistTable($('#blacklistTable'), syncBlockedSiteList, removeBlockedSiteFromAll);
    htmlFunctionality.connectButton($('#saveBtn'), saveNewUrl);
    turnOffSlider = new TurnOffSlider('#turnOff-slider', settings_object);
    htmlFunctionality.setKeyPressFunctions($('#textFld'), blacklistTable, saveNewUrl, removeBlockedSiteFromAll);
    htmlFunctionality.connectButton($('#statisticsLink'), openStatisticsPage);
    htmlFunctionality.connectButton($('#feedbackLink'), openFeedbackForm);
    htmlFunctionality.connectButton($('#tourRestartLink'), restartTour);
}
// functionality from connectDataToHtml file
function connectLocalDataToHtml() {
    connectDataToHtml.loadHtmlInterceptCounter(interceptionCounter, $('#iCounter'));
    connectDataToHtml.loadHtmlBlacklist(blacklist, blacklistTable);
    connectDataToHtml.loadHtmlMode(settings_object.mode, modeGroup);
    connectDataToHtml.loadHtmlInterval(settings_object.interceptionInterval, intervalSlider);
}
/* -------------------- Manipulate local variables ------------------- */

<<<<<<< HEAD
function removeFromLocalBlacklist(html_item) {
    return storage.getBlacklistPromise().then((result) => {
        blacklist = result;
        let blockedSiteToDelete = html_item.data('blockedSite');

        // Remove the blockedSite from the blacklist. There is also a method in BlockedSiteList which does this, but it
        // does not work somehow. Checking whether the domains are equal does seem to work though.
        blacklist.list = blacklist.list.filter(item => item.domain != blockedSiteToDelete.domain);
        return true;
    });
}

function addToLocalBlacklist(blockedSite_item) {
    return storage.getBlacklistPromise().then((result) => {
        blacklist = result;
        return blacklist.addToList(blockedSite_item);
    });
}

function removeBlockedSiteFromAll(html_item) {
    removeFromLocalBlacklist(html_item).then((result) => {
        if (result) {
            blacklistTable.removeFromTable(html_item);
            syncBlockedSiteList();
        }
    });
}

function addBlockedSiteToAll(newItem) {
    addToLocalBlacklist(newItem).then((result) => {
        if (result) {
            blacklistTable.addToTable(blacklistTable.generateTableRow(newItem));
            syncBlockedSiteList();
        }
    });
}

function saveNewUrl() {
    let html_txtFld = $('#textFld');
    let newUrl = html_txtFld.val();
    blockedSiteBuilder.createNewBlockedSite(newUrl, addBlockedSiteToAll);
    html_txtFld.val('');
}
=======
removeFromLocalBlacklist = function(html_item) {
    var blockedSiteToDelete = html_item.data('blockedSite');
    return blacklist.removeFromList(blockedSiteToDelete);
};

addToLocalBlacklist = function(blockedSite_item) {
    return blacklist.addToList(blockedSite_item);
};

removeBlockedSiteFromAll = function (html_item) {
    if (removeFromLocalBlacklist(html_item)) {
        blacklistTable.removeFromTable(html_item);
        synchronizer.syncBlacklist(blacklist);
    }
};

addBlockedSiteToAll = function (newItem) {
    if (addToLocalBlacklist(newItem)) {
        blacklistTable.addToTable(blacklistTable.generateTableRow(newItem));
        synchronizer.syncBlacklist(blacklist);
    }
};

>>>>>>> development
/* -------------------- -------------------------- -------------------- */

function openFeedbackForm() {
    openTabSingleton(feedbackLink);
}

function restartTour() {
    openTabSingleton(chrome.runtime.getURL('introTour/introTour.html'));
}

function openStatisticsPage() {
    openTabSingleton(chrome.runtime.getURL('statisticsPage/statistics.html'));

}

function syncBlockedSiteList() {
    synchronizer.syncBlacklist(blacklist);
}

//Run this when the page is loaded.
document.addEventListener("DOMContentLoaded", function () {
    initOptionsPage();
});

<<<<<<< HEAD
=======
//Tour Restart Function
tr.onclick = function(){
    chrome.tabs.create({'url': chrome.runtime.getURL('introTour/introTour.html')});
};

//Feedback Function
feedback.onclick = function(){
    chrome.tabs.create({'url': chrome.runtime.getURL('feedbackPage/feedback.html')});
};
>>>>>>> development
