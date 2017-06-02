import * as storage from '../modules/storage'
import UserSettings from '../classes/UserSettings'
import BlockedSiteList from '../classes/BlockedSiteList'
import BlacklistTable from './classes/BlacklistTable'
import TurnOffSlider from './classes/TurnOffSlider'
import * as connectDataToHtml from './connectDataToHtml'
import * as htmlFunctionality from './htmlFunctionality'
import * as blockedSiteBuilder from '../modules/blockedSiteBuilder'
import {feedbackLink, tds_blacklist} from '../constants'
import {openTabSingleton} from '../modules/tabutil'

/**
 * This file contains the core functions of the options page. this has all the local variables,
 * initializes everything javascript related and connects the syncStorage,
 * connectDataToHtml, blacklistTable and HtmlFunctionality
 * to one smoothly running file. Besides the initialization it contains the functions to manipulate the local variables
 * found here
 */

let modeGroup = "modeOptions";

let blacklistTable;
let intervalSlider;
let turnOffSlider;

//Local variables that hold all necessary data.
let settings_object = new UserSettings();
let interceptionCounter = 0;

/* -------------------- Initialization of options --------------------- */

/**
 * Initialize HTML elements and set the local variables
 */

//TODO use promise
function initOptionsPage() {
    storage.getAll(function (output) {
        //TODO local => storageData
        setLocalVariables(output);
        connectHtmlFunctionality();
        connectLocalDataToHtml(output);
    });
}
/**
 * Retrieve data from storage and store in local variables
 * @param storage_output the results found by getting everything from the storage
 */
function setLocalVariables(storage_output) {
    settings_object.copySettings(storage_output.tds_settings);
    interceptionCounter = storage_output.tds_interceptCounter;
}

/**
 * connect the funcitonality to the different htl_elements on the optionspage.
 */
function connectHtmlFunctionality() {
    htmlFunctionality.initModeSelection(modeGroup, settings_object);
    intervalSlider = htmlFunctionality.initIntervalSlider(settings_object);
    blacklistTable = new BlacklistTable($('#blacklistTable'));
    htmlFunctionality.connectButton($('#saveBtn'), saveNewUrl);
    turnOffSlider = new TurnOffSlider('#turnOff-slider', settings_object);
    htmlFunctionality.setKeyPressFunctions($('#textFld'), blacklistTable, saveNewUrl);
    htmlFunctionality.connectButton($('#statisticsLink'), openStatisticsPage);
    htmlFunctionality.connectButton($('#feedbackLink'), openFeedbackForm);
    htmlFunctionality.connectButton($('#tourRestartLink'), restartTour);
}

/**
 * connect the data found in the storage to the html_elements on the page
 */
function connectLocalDataToHtml(storage_output) {
    connectDataToHtml.loadHtmlInterceptCounter(interceptionCounter, $('#iCounter'));
    connectDataToHtml.loadHtmlBlacklist(storage_output.tds_blacklist, blacklistTable);
    connectDataToHtml.loadHtmlMode(settings_object.mode, modeGroup);
    connectDataToHtml.loadHtmlInterval(settings_object.interceptionInterval, intervalSlider);
}

/**
 * This function should be called onChange, this checks if it needs to act on the storage change.
 * @param changes {Array} array of objects in storage that have been changed. Contains new & old value
 */

function handleStorageChange(changes){
    if (tds_blacklist in changes) {
        let newBlockedSiteList = BlockedSiteList.deserializeBlockedSiteList(changes[tds_blacklist].newValue);
        let oldBlockedSiteList = BlockedSiteList.deserializeBlockedSiteList(changes[tds_blacklist].oldValue);
        repaint(newBlockedSiteList,oldBlockedSiteList);
    }
}

function repaint(blockedSiteList, oldBlockedSiteList){
    connectDataToHtml.reloadHtmlBlacklist(blockedSiteList, oldBlockedSiteList, blacklistTable);
}

chrome.storage.onChanged.addListener(changes => {
    chrome.extension.getBackgroundPage().console.log("changed! repainted optionspage");
    handleStorageChange(changes)
});

/* -------------------- Manipulate local variables ------------------- */

function saveNewUrl() {
    let html_txtFld = $('#textFld');
    let newUrl = html_txtFld.val();
    blockedSiteBuilder.createNewBlockedSite(newUrl);
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
 * initial function that is fired when the page is loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    initOptionsPage();
});