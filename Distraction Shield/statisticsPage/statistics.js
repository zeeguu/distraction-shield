require.config({
    baseUrl: "./",
    paths : {
        'BlockedSite'               : '../classes/BlockedSite',
        'BlockedSiteList'           : '../classes/BlockedSiteList',
        'UserSettings'              : '../classes/UserSettings',
        'interception'              : '../modules/statistics/interception',
        'storage'                   : '../modules/storage',
        'dateutil'                   : '../modules/dateutil',
        'constants'                 : '../constants',
        'BlacklistStatsTable'       : 'classes/BlacklistStatsTable',
        'ExerciseTimeTable'         : 'classes/ExerciseTimeTable',
        'InterceptionCounterTable'  : 'classes/InterceptionCounterTable',
        'jquery'                    : '../dependencies/jquery/jquery-1.10.2',
        'domReady'                  : '../domReady'

    }
});

require(['BlacklistStatsTable' , 'ExerciseTimeTable', 'InterceptionCounterTable', 'storage', 'interception',
    'jquery', 'domReady'],
    function (BlacklistStatsTable, ExerciseTimeTable, InterceptionCounterTable, storage, interception, $, domReady) {

    var interceptionCounterTable = null;
    var blacklistTable = null;
    var exerciseTimeTable = null;

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
        interceptionCounterTable = new InterceptionCounterTable.InterceptionCounterTable();
        blacklistTable = new BlacklistStatsTable.BlacklistStatsTable($('#interceptTable'));
        exerciseTimeTable = new ExerciseTimeTable.ExerciseTimeTable($('#exerciseTime'));
    };


    //Run this when the page is loaded.
    domReady(function () {
        connectHtmlFunctionality();
        initStatisticsPage();
    });


});
