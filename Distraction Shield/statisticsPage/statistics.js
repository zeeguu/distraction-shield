import BlacklistStatsTable from './classes/BlacklistStatsTable'
import ExerciseTimeTable from './classes/ExerciseTimeTable'
import InterceptionCounterTable from './classes/InterceptionCounterTable'
import * as storage from '../modules/storage'
import * as interception from '../modules/statistics/interception'

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
            let counters = interception.calcInterceptData(interceptDateList);

            interceptionCounterTable.setDataAndRender(counters);
            blacklistTable.setDataAndRender(blacklist);
            exerciseTimeTable.setDataAndRender(exerciseTime);
        });
}

/**
 * Connects HTML functionality to javascript classes
 */
function connectHtmlFunctionality() {
    interceptionCounterTable = new InterceptionCounterTable();
    blacklistTable = new BlacklistStatsTable($('#interceptTable'));
    exerciseTimeTable = new ExerciseTimeTable($('#exerciseTime'));
}

/**
 * initial function that is fired when the page is loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    connectHtmlFunctionality();
    initStatisticsPage();
});