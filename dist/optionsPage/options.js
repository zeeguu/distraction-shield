'use strict';

var _storage = require('../modules/storage');

var storage = _interopRequireWildcard(_storage);

var _UserSettings = require('../classes/UserSettings');

var _UserSettings2 = _interopRequireDefault(_UserSettings);

var _BlockedSiteList = require('../classes/BlockedSiteList');

var _BlockedSiteList2 = _interopRequireDefault(_BlockedSiteList);

var _synchronizer = require('../modules/synchronizer');

var synchronizer = _interopRequireWildcard(_synchronizer);

var _BlacklistTable = require('./classes/BlacklistTable');

var _BlacklistTable2 = _interopRequireDefault(_BlacklistTable);

var _TurnOffSlider = require('./classes/TurnOffSlider');

var _TurnOffSlider2 = _interopRequireDefault(_TurnOffSlider);

var _connectDataToHtml = require('./connectDataToHtml');

var connectDataToHtml = _interopRequireWildcard(_connectDataToHtml);

var _htmlFunctionality = require('./htmlFunctionality');

var htmlFunctionality = _interopRequireWildcard(_htmlFunctionality);

var _blockedSiteBuilder = require('../modules/blockedSiteBuilder');

var blockedSiteBuilder = _interopRequireWildcard(_blockedSiteBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * This file contains the core functions of the options page. this has all the local variables,
 * initializes everything javascript related and connects the syncStorage,
 * connectDataToHtml, blacklistTable and HtmlFunctionality
 * to one smoothly running file. Besides the initialization it contains the functions to manipulate the local variables
 * found here
 */
var html_intCnt = $('#iCounter');
var modeGroup = "modeOptions";

var blacklistTable = void 0;
var intervalSlider = void 0;
var turnOffSlider = void 0;
var tr = $('#tourRestart');

//Local variables that hold all necessary data.
var settings_object = new _UserSettings2.default();
var blacklist = new _BlockedSiteList2.default();
var interceptionCounter = 0;

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
    blacklistTable = new _BlacklistTable2.default($('#blacklistTable'), syncBlockedSiteList, removeBlockedSiteFromAll);
    var html_saveButton = $('#saveBtn');
    htmlFunctionality.connectButton(html_saveButton, saveNewUrl);
    turnOffSlider = new _TurnOffSlider2.default('#turnOff-slider', settings_object);
    var html_txtFld = $('#textFld');
    htmlFunctionality.setKeyPressFunctions(html_txtFld, blacklistTable, saveNewUrl, removeBlockedSiteFromAll);
}
// functionality from connectDataToHtml file
function connectLocalDataToHtml() {
    connectDataToHtml.loadHtmlInterceptCounter(interceptionCounter, html_intCnt);
    connectDataToHtml.loadHtmlBlacklist(blacklist, blacklistTable);
    connectDataToHtml.loadHtmlMode(settings_object.mode, modeGroup);
    connectDataToHtml.loadHtmlInterval(settings_object.interceptionInterval, intervalSlider);
}
/* -------------------- Manipulate local variables ------------------- */

function removeFromLocalBlacklist(html_item) {
    var blockedSiteToDelete = html_item.data('blockedSite');
    return blacklist.removeFromList(blockedSiteToDelete);
}

function addToLocalBlacklist(blockedSite_item) {
    return blacklist.addToList(blockedSite_item);
}

function removeBlockedSiteFromAll(html_item) {
    console.log(html_item);
    if (removeFromLocalBlacklist(html_item)) {
        blacklistTable.removeFromTable(html_item);
        syncBlockedSiteList();
    }
}

function addBlockedSiteToAll(newItem) {
    if (addToLocalBlacklist(newItem)) {
        blacklistTable.addToTable(blacklistTable.generateTableRow(newItem));
        syncBlockedSiteList();
    }
}

function saveNewUrl() {
    var html_txtFld = $('#textFld');
    var newUrl = html_txtFld.val();
    blockedSiteBuilder.createNewBlockedSite(newUrl, addBlockedSiteToAll);
    html_txtFld.val('');
}
/* -------------------- -------------------------- -------------------- */

function syncBlockedSiteList() {
    synchronizer.syncBlacklist(blacklist);
}
//Run this when the page is loaded.

document.addEventListener("DOMContentLoaded", function () {
    initOptionsPage();
});

//Tour Restart Function
tr.onclick = function () {
    chrome.tabs.create({ 'url': chrome.runtime.getURL('introTour/introTour.html') });
};