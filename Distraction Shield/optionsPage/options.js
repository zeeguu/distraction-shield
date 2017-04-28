require.config({
    baseUrl: "./",
    paths : {
        'BlockedSite'       : '../classes/BlockedSite',
        'BlockedSiteList'   : '../classes/BlockedSiteList',
        'UserSettings'      : '../classes/UserSettings',
        'api'               : '../modules/authentication/api',
        'auth'              : '../modules/authentication/auth',
        'exerciseTime'      : '../modules/statistics/exerciseTime',
        'interception'      : '../modules/statistics/interception',
        'tracker'           : '../modules/statistics/tracker',
        'blockedSiteBuilder': '../modules/blockedSiteBuilder',
        'dateutil'          : '../modules/dateutil',
        'storage'           : '../modules/storage',
        'synchronizer'      : '../modules/synchronizer',
        'urlFormatter'      : '../modules/urlFormatter',
        'BlacklistTable'    : 'classes/BlacklistTable',
        'GreenToRedSlider'  : 'classes/GreenToRedSlider',
        'TurnOffSlider'     : 'classes/TurnOffSlider',
        'constants'         : '../constants',
        'jquery'            : '../dependencies/jquery/jquery-1.10.2',
        'background'        : '../background'

    }
});

require (['storage','UserSettings','BlockedSiteList','synchronizer', 'BlacklistTable','GreenToRedSlider', 'TurnOffSlider','connectDataToHtml', 'htmlFunctionality','jquery'],
function options (storage, UserSettings, BlockedSiteList, synchronizer, BlacklistTable, GreenToRedSlider, TurnOffSlider, connectDataToHtml, htmlFunctionality,$) {

    /**
     * This file contains the core functions of the options page. this has all the local variables,
     * initializes everything javascript related and connects the syncStorage,
     * connectDataToHtml, blacklistTable and HtmlFunctionality
     * to one smoothly running file. Besides the initialization it contains the functions to manipulate the local variables
     * found here
     */

    // Log console messages to the background page console instead of the content page.
    // var console = chrome.extension.getBackgroundPage().console;

    console.log('options.js loading...'); //todo remove

    //Local variables that hold the html elements
    var html_txtFld = $('#textFld');
    var html_intCnt = $('#iCounter');
    var html_saveButton = $('#saveBtn');
    var modeGroup = "modeOptions";

    var blacklistTable;
    var intervalSlider;
    var turnOffSlider;
    var tr = document.getElementById("tourRestart");

    //Local variables that hold all necessary data.
    var settings_object = new UserSettings.UserSettings();
    var blacklist = new BlockedSiteList.BlockedSiteList();
    var interceptionCounter = 0;

    /* -------------------- Initialization of options --------------------- */

    //Initialize HTML elements and set the local variables
    initOptionsPage = function () {
        console.log("called"); //todo remove
        storage.getAll(function (output) {
            console.log("storage returned"); //todo remove
            setLocalVariables(output);
            connectHtmlFunctionality();
            connectLocalDataToHtml();
        });
    };

    //Retrieve data from storage and store in local variables
    setLocalVariables = function (storage_output) {
        blacklist.addAllToList(storage_output.tds_blacklist);
        settings_object.copySettings(storage_output.tds_settings);
        interceptionCounter = storage_output.tds_interceptCounter;
    };

    // functionality from htmlFunctionality, blacklist_table and slider files
    connectHtmlFunctionality = function () {
        console.log('connectHtmlFunctionality');//todo remove
        htmlFunctionality.initModeSelection(modeGroup);
        htmlFunctionality.initIntervalSlider();
        blacklistTable = new BlacklistTable.BlacklistTable($('#blacklistTable'));
        connectButton(html_saveButton, htmlFunctionality.saveNewUrl);
        turnOffSlider = new TurnOffSlider.TurnOffSlider('#turnOff-slider');
        htmlFunctionality.setKeyPressFunctions();
    };

    // functionality from connectDataToHtml file
    connectLocalDataToHtml = function () {
        connectDataToHtml.loadHtmlInterceptCounter(interceptionCounter, html_intCnt);
        connectDataToHtml.loadHtmlBlacklist(blacklist, blacklistTable);
        connectDataToHtml.loadHtmlMode(settings_object.getMode(), modeGroup);
        connectDataToHtml.loadHtmlInterval(settings_object.getInterceptionInterval(), intervalSlider);
    };

    /* -------------------- Manipulate local variables ------------------- */

    removeFromLocalBlacklist = function (html_item) {
        var blockedSiteToDelete = html_item.data('blockedSite');
        return blacklist.removeFromList(blockedSiteToDelete);
    };

    addToLocalBlacklist = function (blockedSite_item) {
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
    /* -------------------- -------------------------- -------------------- */

    // document.addEventListener("DOMContentLoaded", function () {
    if (DOMContentLoadedFired) {
        console.log('initoptions added as listener'); //todo remove
        initOptionsPage();
        DOMContentLoadedFired = false;
    };

    //Tour Restart Function
    tr.onclick = function () {
        chrome.tabs.create({'url': chrome.runtime.getURL('introTour/introTour.html')});
    };

});