import BlacklistStatsTable from '/classes/BlacklistStatsTable'
import ExerciseTimeTable from '/classes/ExerciseTimeTable'
import InterceptionCounterTable from '/classes/InterceptionCounterTable'
import * as storage from '../modules/storage'
import * as interception from '../modules/statistics/interception'
import * as $ from "../dependencies/jquery/jquery-1.10.2";
import * as domReady from '../domReady'


    let interceptionCounterTable = null;
    let blacklistTable = null;
    let exerciseTimeTable = null;

    //Initialize HTML elements and set the data in the tables.
    initStatisticsPage = function() {
        Promise.all([storage.getInterceptDateList(), storage.getExerciseTimeList()])
            .then(function(response){
                let counters = interception.calcInterceptData(response[0].tds_interceptDateList);
                //TODO : are the setDataAndRender calls right?
                interceptionCounterTable.setDataAndRender(counters);
                storage.getBlacklist(blacklistTable.setDataAndRender);
                exerciseTimeTable.setDataAndRender(response[1]);
            });
    };

    // Connects html items to the tables.
    connectHtmlFunctionality = function() {
        interceptionCounterTable = new InterceptionCounterTable();
        blacklistTable = new BlacklistStatsTable($('#interceptTable'));
        exerciseTimeTable = new ExerciseTimeTable($('#exerciseTime'));
    };

    //TODO how should this be done now?
    //Run this when the page is loaded.
    domReady(function () {
        connectHtmlFunctionality();
        initStatisticsPage();
    });