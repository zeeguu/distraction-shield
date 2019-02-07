import * as dateutil from "../../modules/dateutil"
import BasicTable from "./BasicTable"

export default class TotalTimeTable extends BasicTable {

  /**
   * This functions generates an HTML row containing total time wasted on blocked sites and total time invested in
   * practicing a foreign language on th Zeeguu platform
   * @param item item containing the total wasted time and total invested time
   * @return {JQuery|jQuery|HTMLElement} HTML row from the data
   * @function TotalTimeTable#generateTableRow
   * @memberof! TotalTimeTable
   */
  generateTableRow(item) {
    return $("<tr>" +
      "<td>" + dateutil.msToHHMMSS(item.timeInvested) + "</td>" +
      "<td>" + dateutil.msToHHMMSS(item.timeWasted) + "</td>" +
      "</tr>");
  }
}
