'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.calcInterceptData = calcInterceptData;
exports.incrementInterceptionCounter = incrementInterceptionCounter;
exports.addToInterceptDateList = addToInterceptDateList;

var _storage = require('../storage');

var storage = _interopRequireWildcard(_storage);

var _constants = require('../../constants');

var constants = _interopRequireWildcard(_constants);

var _stringutil = require('../stringutil');

var stringutil = _interopRequireWildcard(_stringutil);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// This method goes through the interceptDateList and count how many times the user was intercepted last day,
// last week, last month and the total amount of interceptions.
function calcInterceptData(dateList) {
    var tmp = dateList;
    var countDay = 0,
        countWeek = 0,
        countMonth = 0,
        countTotal = 0;

    if (tmp !== null) {
        var firstDate = new Date();
        var length = tmp.length;
        for (var i = 0; i < length; i++) {
            var secondDate = new Date(tmp.pop());
            var _diffDays = Math.floor(Math.abs((firstDate.getTime() - secondDate.getTime()) / constants.oneDay));
            if (_diffDays === 0) {
                countDay++;
            }
            if (_diffDays <= 7) {
                countWeek++;
            }
            if (_diffDays <= 31) {
                countMonth++;
            }
            countTotal++;
        }
    }
    return {
        countDay: countDay,
        countWeek: countWeek,
        countMonth: countMonth,
        countTotal: countTotal
    };
}

// Receives the url from the parameter, and searches the correct blockedSite item from the blockedsite list.
// Then the interceptioncounter for this item is incremented by 1.
// Also the global interceptioncounter is incremented by one.
function incrementInterceptionCounter(urlAddress, blockedSites) {
    var urlList = blockedSites.list;
    for (var i = 0; i < urlList.length; i++) {
        if (stringutil.wildcardStrComp(urlAddress, urlList[i].url)) {
            urlList[i].counter = urlList[i].counter + 1;
            break;
        }
        if (diffDays <= 31) {
            countMonth++;
        }
        countTotal++;
    }

    storage.setBlacklist(blockedSites);
    storage.getInterceptCounter().then(function (output) {
        var counter = output.tds_interceptCounter;
        counter++;
        storage.setInterceptCounter(counter);
    });
}

// This function adds the current time+date to the saved time+date list
function addToInterceptDateList() {
    var interceptDateList = void 0;
    storage.getInterceptDateList().then(function (result) {
        interceptDateList = result.tds_interceptDateList;
    }).then(function () {
        var newDate = new Date().toDateString();
        if (interceptDateList === null) {
            interceptDateList = [newDate];
        } else {
            interceptDateList.push(newDate);
        }
    }).then(function () {
        storage.setInterceptDateList(interceptDateList);
    });
}