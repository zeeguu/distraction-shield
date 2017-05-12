'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.incrementTodayExerciseTime = incrementTodayExerciseTime;

var _storage = require('../storage');

var storage = _interopRequireWildcard(_storage);

var _dateutil = require('../dateutil');

var dateutil = _interopRequireWildcard(_dateutil);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Increments the counter for time spent on exercises today with 'amount'.
// When there the current day does not exist in the storage yet, initialize the counter for this day at 0.
function incrementTodayExerciseTime(amount) {
    var exerciseTimeList = void 0;
    storage.getExerciseTimeList().then(function (response) {
        exerciseTimeList = response;
        var today = dateutil.getToday();
        if (exerciseTimeList === null) {
            exerciseTimeList = {};
        }
        if (exerciseTimeList[today] === null) {
            exerciseTimeList[today] = 0;
        }
        exerciseTimeList[today] += amount;
    }).then(function () {
        storage.setExerciseTimeList(exerciseTimeList);
    });
}