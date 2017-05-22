//import * as $ from "../../dependencies/jquery/jquery-1.10.2";
import * as dateutil from "../../modules/dateutil"

export default class ExerciseTimeTable{
    constructor(html_element){
        this._table = html_element;
        this._timeSpentData = null;
    }

    // This has to be a function because it is called in a Promise
    setData(data){
        this._timeSpentData = data;
    }

    addToTable(tableRow) {
        this._table.append(tableRow);
    }

    generateExerciseTimeHtmlRow(date, exerciseTime) {
        return $("<tr>" +
                 "<td>"+date+"</td>" +
                 "<td>"+dateutil.secondsToHHMMSS(exerciseTime)+"</td>" +
                 "</tr>");
    }

    createExerciseTimeTable(list) {
        let rows = list.reverse().map((site) => this.generateExerciseTimeHtmlRow(site.date, site.timeSpent));
        this._table.append(rows);
    }

    render(){
        this.createExerciseTimeTable(this._timeSpentData);
    }

    setDataAndRender(data){
        Promise.resolve(this.setData(data)).then(this.render());
    }
}