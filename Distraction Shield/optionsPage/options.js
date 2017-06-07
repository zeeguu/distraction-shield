import * as blockedSiteBuilder from '../modules/blockedSiteBuilder'
import {openTabSingleton} from '../modules/browserutil'
import * as storage from '../modules/storage/storage'
import StorageListener from "../modules/storage/StorageListener"
import UserSettings from '../classes/UserSettings'
import BlockedSiteList from '../classes/BlockedSiteList'
import BlacklistTable from './classes/BlacklistTable'
import TurnOffSlider from './classes/TurnOffSlider'
import * as connectDataToHtml from './connectDataToHtml'
import * as htmlFunctionality from './htmlFunctionality'
import {feedbackLink, tds_blacklist, tds_settings, tds_interceptCounter} from '../constants'
import {initDataCollectionModal} from '../introTour/dataCollection'

/**
 * This file contains the core functions of the options page. this has all the local variables,
 * initializes everything javascript related and connects the syncStorage,
 * connectDataToHtml, blacklistTable and HtmlFunctionality
 * to one smoothly running file. Besides the initialization it contains the functions to manipulate the local variables
 * found here
 */

let modeGroup = "modeOptions";

let blockedSiteListTable;
let intervalSlider;
let turnOffSlider;

/* -------------------- Initialization of options --------------------- */

/**
 * initial function that is fired when the page is loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    initOptionsPage();
});

/**
 * Initialize HTML elements and set the local variables
 */
function initOptionsPage() {
    storage.getAll(function (output) {
        connectHtmlFunctionality(output.tds_settings);
        connectStorageDataToHtml(output);
    });
}

/**
 * connect the functionality to the different htl_elements on the optionspage.
 */
function connectHtmlFunctionality(userSettings) {
    htmlFunctionality.initModeSelection(modeGroup, userSettings);
    intervalSlider = htmlFunctionality.initIntervalSlider(userSettings);
    blockedSiteListTable = new BlacklistTable($('#blacklistTable'));
    turnOffSlider = new TurnOffSlider('#turnOff-slider');
    htmlFunctionality.connectButton($('#turnOff-slider-offBtn'), turnOffSlider.offButtonFunc);
    htmlFunctionality.connectButton($('#saveBtn'), saveNewUrl);
    htmlFunctionality.connectButton($('#statisticsLink'), openStatisticsPage);
    htmlFunctionality.connectButton($('#feedbackButton'), openFeedbackForm);
    htmlFunctionality.connectButton($('#tourRestartButton'), restartTour);
    htmlFunctionality.connectButton($('#dataSettingsButton'), openDataCollectionConsent)
    htmlFunctionality.setKeyPressFunctions($('#textFld'), saveNewUrl);
}

/**
 * connect the data found in the storage to the html_elements on the page
 */
function connectStorageDataToHtml(storage_output) {
    loadInterceptionCounter(storage_output.tds_interceptCounter);
    loadBlockedSiteList(storage_output.tds_blacklist);
    loadSettings(storage_output.tds_settings);
}

function loadBlockedSiteList(blockedSiteList){
    connectDataToHtml.loadHtmlBlacklist(blockedSiteList, blockedSiteListTable);
}

function loadSettings(settings_object){
    connectDataToHtml.loadHtmlMode(settings_object.mode, modeGroup);
    connectDataToHtml.loadHtmlInterval(settings_object.interceptionInterval, intervalSlider);
}

function loadInterceptionCounter(val){
    connectDataToHtml.loadHtmlInterceptCounter(val, $('#iCounter'));
}

function reloadTable(blockedSiteList, oldBlockedSiteList) {
    connectDataToHtml.reloadHtmlBlacklist(blockedSiteList, oldBlockedSiteList, blockedSiteListTable);
}

/* -------------------- Manipulate local variables ------------------- */

function resetMessageBox() {
    document.querySelector('#message-box').innerText = '';
}

/* -------------------- Act upon change of storage ------------------- */

/**
 * This function should be called onChange, this checks if it needs to act on the storage change.
 * @param changes {Array} array of objects in storage that have been changed. Contains new & old value
 */
new StorageListener((changes) => {
    if (tds_blacklist in changes) {
        let newBlockedSiteList = BlockedSiteList.deserializeBlockedSiteList(changes[tds_blacklist].newValue);
        let oldBlockedSiteList = BlockedSiteList.deserializeBlockedSiteList(changes[tds_blacklist].oldValue);
        reloadTable(newBlockedSiteList,oldBlockedSiteList);
    } if (tds_settings in changes) {
        let newSettings = UserSettings.deserializeSettings(changes[tds_settings].newValue);
        loadSettings(newSettings);
    } if (tds_interceptCounter in changes) {
        loadInterceptionCounter(changes[tds_interceptCounter].newValue);
    }
});

/* -------------------- Manipulate local variables ------------------- */

function saveNewUrl() {
    resetMessageBox();
    let html_txtFld = $('#textFld');
    let newUrl = html_txtFld.val();
    blockedSiteBuilder.createBlockedSiteAndAddToStorage(newUrl)
        .catch(error => {$('#message-box').text(error)});
    html_txtFld.val('');
}

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

/**
 * This function loads the button functionality for the modal. This can only be loaded when the modal is shown,
 * since the html is added dynamically
 */
function openDataCollectionConsent(){
    initDataCollectionModal($('#dataConsentModal'));
}
