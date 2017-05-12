'use strict';

var _BlacklistStatsTable = require('/classes/BlacklistStatsTable');

var _BlacklistStatsTable2 = _interopRequireDefault(_BlacklistStatsTable);

var _ExerciseTimeTable = require('/classes/ExerciseTimeTable');

var _ExerciseTimeTable2 = _interopRequireDefault(_ExerciseTimeTable);

var _InterceptionCounterTable = require('/classes/InterceptionCounterTable');

var _InterceptionCounterTable2 = _interopRequireDefault(_InterceptionCounterTable);

var _storage = require('../modules/storage');

var storage = _interopRequireWildcard(_storage);

var _interception = require('../modules/statistics/interception');

var interception = _interopRequireWildcard(_interception);

var _jquery = require('../dependencies/jquery/jquery-1.10.2');

var $ = _interopRequireWildcard(_jquery);

var _domReady = require('../domReady');

var domReady = _interopRequireWildcard(_domReady);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var interceptionCounterTable = null;
var blacklistTable = null;
var exerciseTimeTable = null;

//Initialize HTML elements and set the data in the tables.
initStatisticsPage = function initStatisticsPage() {
    Promise.all([storage.getInterceptDateList(), storage.getExerciseTimeList()]).then(function (response) {
        var counters = interception.calcInterceptData(response[0].tds_interceptDateList);
        //TODO : are the setDataAndRender calls right?
        interceptionCounterTable.setDataAndRender(counters);
        storage.getBlacklist(blacklistTable.setDataAndRender);
        exerciseTimeTable.setDataAndRender(response[1]);
    });
};

// Connects html items to the tables.
connectHtmlFunctionality = function connectHtmlFunctionality() {
    interceptionCounterTable = new _InterceptionCounterTable2.default();
    blacklistTable = new _BlacklistStatsTable2.default($('#interceptTable'));
    exerciseTimeTable = new _ExerciseTimeTable2.default($('#exerciseTime'));
};

//TODO how should this be done now?
//Run this when the page is loaded.
domReady(function () {
    connectHtmlFunctionality();
    initStatisticsPage();
});