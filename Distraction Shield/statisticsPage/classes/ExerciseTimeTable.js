import * as dateutil from "../../modules/dateutil"
import BasicTable from "./BasicTable"

/**
 * Table which is used to display the amount of time the user
 * has spent on exercises on the Zeeguu page.
 */
export default class ExerciseTimeTable extends BasicTable {

    /**
     * This functions generates HTML rows containing data of one BlockedSite
     * @param item {BlockedSite} blockedSite which data is used for the table row
     * @return string containing a HTML row
     */
    generateTableRow(item) {
        return $("<tr>" +
            "<td>" + item.date + "</td>" +
            "<td>" + dateutil.msToHHMMSS(item.timeSpent) + "</td>" +
            "</tr>");
    }
}