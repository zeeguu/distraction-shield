"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //import * as $ from "../../dependencies/jquery/jquery-1.10.2";


var _dateutil = require("../../modules/dateutil");

var dateutil = _interopRequireWildcard(_dateutil);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExerciseTimeTable = function () {
    function ExerciseTimeTable(html_element) {
        _classCallCheck(this, ExerciseTimeTable);

        this._table = html_element;
        this._timeSpentData = null;
    }

    // This has to be a function because it is called in a Promise


    _createClass(ExerciseTimeTable, [{
        key: "setData",
        value: function setData(data) {
            this._timeSpentData = data;
        }
    }, {
        key: "addToTable",
        value: function addToTable(tableRow) {
            this._table.append(tableRow);
        }
    }, {
        key: "generateExerciseTimeHtmlRow",
        value: function generateExerciseTimeHtmlRow(date, exerciseTime) {
            return $("<tr>" + "<td>" + date + "</td>" + "<td>" + dateutil.secondsToHHMMSS(exerciseTime) + "</td>" + "</tr>");
        }
    }, {
        key: "createExerciseTimeTable",
        value: function createExerciseTimeTable(list) {
            var keys = Object.keys(list);
            for (var i = keys.length - 1; i >= 0; i--) {
                this.addToTable(this.generateExerciseTimeHtmlRow(keys[i], list[keys[i]]));
            }
        }
    }, {
        key: "render",
        value: function render() {
            this.createExerciseTimeTable(this.timeSpentData);
        }
    }, {
        key: "setDataAndRender",
        value: function setDataAndRender(data) {
            Promise.resolve(this.setData(data)).then(this.render());
        }
    }]);

    return ExerciseTimeTable;
}();

exports.default = ExerciseTimeTable;