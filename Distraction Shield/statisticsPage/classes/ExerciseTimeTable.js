import * as $ from "../../dependencies/jquery/jquery-1.10.2";
import * as dateutil from "../../modules/dateutil"

    export default class ExerciseTimeTable{
        constructor(html_element){
            this._table = html_element;
            this._timeSpentData = null;
        }

        // This has to be a function because it is called in a Promise
        setData(data){
            this._timeSpentData = data;
        };

        addToTable(tableRow) {
            this._table.append(tableRow);
        };

        generateExerciseTimeHtmlRow(date, exerciseTime) {
            return $("<tr>" +
                     "<td>"+date+"</td>" +
                     "<td>"+dateutil.secondsToHHMMSS(exerciseTime)+"</td>" +
                     "</tr>");
        };

        createExerciseTimeTable(list) {
            let keys = Object.keys(list);
            for(let i = keys.length-1; i >= 0; i--){
                this.addToTable(this.generateExerciseTimeHtmlRow(keys[i], list[keys[i]]));
            }
        };

        render(){
            this.createExerciseTimeTable(this.timeSpentData);
        };

        setDataAndRender(data){
            Promise.resolve(this.setData(data)).then(this.render());
        };
    }