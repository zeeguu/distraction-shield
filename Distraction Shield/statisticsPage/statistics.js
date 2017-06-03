import BlacklistStatsTable from './classes/BlacklistStatsTable'
import ExerciseTimeTable from './classes/ExerciseTimeTable'
import InterceptionCounterTable from './classes/InterceptionCounterTable'
import BlockedSiteList from '../classes/BlockedSiteList.js'
import * as storage from '../modules/storage'
import * as interception from '../modules/statistics/interception'
import {tds_blacklist, tds_interceptDateList, tds_exerciseTime} from '../constants'

let interceptionCounterTable = null;
let blacklistTable = null;
let exerciseTimeTable = null;

/**
 * This file contains the code and functions which control the statistics page.
 * Data is retrieved from the storage, and is passed to various tables.
 */

/**
 * Initialize HTML elements and set the data in the tables. Retrieves the data from the storage using Promises.
 * Waits until all data is retrieved, and then populates the interceptionCounterTable, the blacklistTable and the
 * exerciseTimeTable.
 */
function initStatisticsPage() {
    Promise.all([storage.getInterceptDateList(), storage.getExerciseTimeList(), storage.getBlacklistPromise()])
        .then(function (response) {
            let interceptDateList = response[0].tds_interceptDateList;
            let blacklist = response[2];
            let exerciseTime = response[1];


            setInterceptionCounterTable(interceptDateList);
            blacklistTable.setDataAndRender(blacklist);
            exerciseTimeTable.setDataAndRender(exerciseTime);
        });
}

function setInterceptionCounterTable(interceptDateList){
    let counters = interception.calcInterceptData(interceptDateList);
    interceptionCounterTable.setDataAndRender(counters);
}

/**
 * Connects HTML functionality to javascript classes
 */
function connectHtmlFunctionality() {
    interceptionCounterTable = new InterceptionCounterTable();
    blacklistTable = new BlacklistStatsTable($('#interceptTable'));
    exerciseTimeTable = new ExerciseTimeTable($('#exerciseTime'));
}


//TODO extend repainting.
function handleStorageChange(changes){
    if (tds_blacklist in changes) {
        let newBlockedSiteList = BlockedSiteList.deserializeBlockedSiteList(changes[tds_blacklist].newValue);
        blacklistTable.repaint(newBlockedSiteList);
    }
    // if (tds_exerciseTime in changes)
    //     chrome.extension.getBackgroundPage().console.log(changes[tds_exerciseTime].newValue);
    // if (tds_interceptDateList in changes)
    //     chrome.extension.getBackgroundPage().console.log(changes[tds_interceptDateList].newValue);


}

chrome.storage.onChanged.addListener(changes => {
    handleStorageChange(changes)
});

/**
 * initial function that is fired when the page is loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    connectHtmlFunctionality();
    initStatisticsPage();
});