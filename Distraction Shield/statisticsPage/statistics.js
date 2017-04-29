require.config({
    baseUrl: "./",
    paths : {
        'BlockedSite'               : '../classes/BlockedSite',
        'BlockedSiteList'           : '../classes/BlockedSiteList',
        'UserSettings'              : '../classes/UserSettings',
        'api'                       : '../modules/authentication/api',
        'auth'                      : '../modules/authentication/auth',
        'exerciseTime'              : '../modules/statistics/exerciseTime',
        'interception'              : '../modules/statistics/interception',
        'tracker'                   : '../modules/statistics/tracker',
        'blockedSiteBuilder'        : '../modules/blockedSiteBuilder',
        'dateutil'                  : '../modules/dateutil',
        'storage'                   : '../modules/storage',
        'synchronizer'              : '../modules/synchronizer',
        'urlFormatter'              : '../modules/urlFormatter',
        'background'                : '../background',
        'constants'                 : '../constants',
        'BlacklistStatsTable'       : 'classes/BlacklistStatsTable',
        'ExerciseTimeTable'         : 'classes/ExerciseTimeTable',
        'InterceptionCounterTable'  : 'classes/InterceptionCounterTable',
        'jquery'                    : '../dependencies/jquery/jquery-1.10.2',
        'domReady'                  : '../domReady'

    }
});

require(['background', 'BlacklistStatsTable' , 'ExerciseTimeTable', 'InterceptionCounterTable', 'storage', 'interception',
    'jquery', 'domReady'],
    function (background, BlacklistStatsTable, ExerciseTimeTable, InterceptionCounterTable, storage, interception, $, domReady) {

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
    domReady( function(){
        connectHtmlFunctionality();
        initStatisticsPage();
    });
});
