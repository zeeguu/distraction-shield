import BlacklistStatsTable from './classes/BlacklistStatsTable'
import ExerciseTimeTable from './classes/ExerciseTimeTable'
import InterceptionCounterTable from './classes/InterceptionCounterTable'
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
            let interceptDateList = response[0].tds_interceptDateList;
            let blacklist = response[2];
            let exerciseTime = response[1];

            let counters = interception.calcInterceptData(interceptDateList);
            interceptionCounterTable.setDataAndRender(counters);
            blacklistTable.setDataAndRender(blacklist);
            exerciseTimeTable.setDataAndRender(exerciseTime);
        });
}

// Connects html items to the tables.
function connectHtmlFunctionality () {
    interceptionCounterTable = new InterceptionCounterTable();
    blacklistTable = new BlacklistStatsTable($('#interceptTable'));
    exerciseTimeTable = new ExerciseTimeTable($('#exerciseTime'));
}

document.addEventListener("DOMContentLoaded", function() {
    connectHtmlFunctionality();
    initStatisticsPage();
});