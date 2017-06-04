import * as dateutil from "../../modules/dateutil"

/**
 * Table which is used to display the amount of time the user
 * has spent on exercises on the Zeeguu page.
 */
export default class ExerciseTimeTable {
    constructor(html_element) {
        this._table = html_element;
        this._timeSpentData = null;
    }

    /**
     * Sets the data which is presented to the user.
     * @param data the data received from the statistics.js code.
     */
    setData(data) {
        this._timeSpentData = data;
    }

    /**
     * This functions generates HTML rows containing data of one BlockedSite
     * @param date date at which the user spent time on exercises
     * @param exerciseTime how much time the user has spent on exercises
     * @return string containing a HTML row
     */
    generateExerciseTimeHtmlRow(date, exerciseTime) {
        return $("<tr>" +
            "<td>" + date + "</td>" +
            "<td>" + dateutil.secondsToHHMMSS(exerciseTime) + "</td>" +
            "</tr>");
    }

    /**
     * This functions appends HTML rows to the html element of the table.
     * @param list list containing dates and the amount of time spent on exercises.
     */
    createExerciseTimeTable(list) {
        let rows = list.reverse().map((site) => this.generateExerciseTimeHtmlRow(site.date, site.timeSpent));
        this._table.append(rows);
    }

    /**
     * This function renders the data to the screen in the correct format.
     */
    render() {
        this.createExerciseTimeTable(this._timeSpentData);
    }

    /**
     * This functions wraps the functions setData and render in one function.
     * @param data the data received from the statistics.js page.
     */
    setDataAndRender(data) {
        Promise.resolve(this.setData(data)).then(this.render());
    }

    repaint(data) {
        this._table.find("tr:gt(1)").remove();
        this.setDataAndRender(data);
    }
}