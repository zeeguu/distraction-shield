import * as dateutil from "../../modules/dateutil"

/**
 * Table which is used to display data about the amount of interception a user has, and the amount of time the user
 * has spent on a certain blacklisted website.
 */
export default  class BlacklistStatsTable {
    constructor(html_element) {
        this._table = html_element;
        this._blacklist = null;
    }

    /**
     * Sets the data which is presented to the user.
     * @param data the data received from the statistics.js code.
     */
    setData(data) {
        this._blacklist = data;
    }

    /**
     * This functions appends HTML rows to the html element of the table.
     * @param siteList item containing a list of BlockedSite elements
     */
    createBlockedSiteTable(siteList) {
        this._table.append(siteList.map(this.generateTableRow));
    }

    /**
     * This functions generates HTML rows containing data of one BlockedSite
     * @param site a BlockedSite of which the data is used
     * @return string containing a HTML row
     */
    generateTableRow(site) {
        return $("<tr class='table-row' >" +
            "<td>" + site.icon + "</td>" +
            "<td>" + site.name + "</td>" +
            "<td>" + site.counter + "</td>" +
            "<td>" + dateutil.secondsToHHMMSS(site.timeSpent) + "</td>" +
            "</tr>");
    }
    /**
     * This function renders the data to the screen in the correct format.
     */
    render() {
        this.createBlockedSiteTable(this._blacklist.list);
    }

    /**
     * This functions wraps the functions setData and render in one function.
     * @param data the data received from the statistics.js page.
     */
    setDataAndRender(data) {
        Promise.resolve(this.setData(data)).then(this.render());
    }
}


