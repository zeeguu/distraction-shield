"use strict";

function ExerciseTimeTable(html_element) {
    var self = this;
    this.table = html_element;
    this.timeSpentData = null;

    this.setData = function (data) {
        self.timeSpentData = data;
    };

    this.addToTable = function (tableRow) {
        html_element.append(tableRow);
    };

    this.generateExerciseTimeHtmlRow = function (date, exerciseTime) {
        var tableRow = $("<tr>" + "<td>" + date + "</td>" + "<td>" + bg.dateUtil.secondsToHHMMSS(exerciseTime) + "</td>" + "</tr>");
        return tableRow;
    };

    this.createExerciseTimeTable = function (list) {
        var keys = Object.keys(list);
        for (var i = keys.length - 1; i >= 0; i--) {
            self.addToTable(self.generateExerciseTimeHtmlRow(keys[i], list[keys[i]]));
        }
    };

    this.render = function () {
        self.createExerciseTimeTable(self.timeSpentData);
    };

    this.setDataAndRender = function (data) {
        Promise.resolve(this.setData(data)).then(self.render());
    };
}