import BlacklistStatsTable from './classes/BlacklistStatsTable'
import ExerciseTimeTable from './classes/ExerciseTimeTable'
import InterceptionCounterTable from './classes/InterceptionCounterTable'
import BlockedSiteList from '../classes/BlockedSiteList'
import * as storage from '../modules/storage'
import * as interception from '../modules/statistics/interception'
//import * as $ from "../dependencies/jquery/jquery-1.10.2";
// import * as domReady from '../domReady'


let interceptionCounterTable = null;
let blacklistTable = null;
let exerciseTimeTable = null;

//Initialize HTML elements and set the data in the tables.
function initStatisticsPage () {
    Promise.all([storage.getInterceptDateList(), storage.getExerciseTimeList(), storage.getBlacklistPromise()])
        .then(function (response) {
            let counters = interception.calcInterceptData(response[0].tds_interceptDateList);
            //TODO : are the setDataAndRender calls right?
            interceptionCounterTable.setDataAndRender(counters);
            blacklistTable.setDataAndRender(response[2]);
            exerciseTimeTable.setDataAndRender(response[1]);
        });
}

// Connects html items to the tables.
function connectHtmlFunctionality () {
    interceptionCounterTable = new InterceptionCounterTable();
    blacklistTable = new BlacklistStatsTable($('#interceptTable'));
    exerciseTimeTable = new ExerciseTimeTable($('#exerciseTime'));
}

//TODO how should this be done now?
//Run this when the page is loaded.
// domReady(function () {
//
// });

document.addEventListener("DOMContentLoaded", function() {
    connectHtmlFunctionality();
    initStatisticsPage();
});