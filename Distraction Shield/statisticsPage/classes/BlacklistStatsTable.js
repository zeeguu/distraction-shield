import * as dateutil from "../../modules/dateutil"

export default  class BlacklistStatsTable {
    constructor(html_element) {
        this._table = html_element;
        this._blacklist = null;
    }

    // This has to be a function because it is called in a Promise
    setData(data) {
        this._blacklist = data;
    }

    createBlockedSiteTable(siteList) {
        this._table.append(siteList.map(this.generateTableRow));
    }

    generateTableRow(site) {
        return $("<tr class='table-row' >" +
            "<td>" + site.icon + "</td>" +
            "<td>" + site.name + "</td>" +
            "<td>" + site.counter + "</td>" +
            "<td>" + dateutil.secondsToHHMMSS(site.timeSpent) + "</td>" +
            "</tr>");
    }

    render() {
        this.createBlockedSiteTable(this._blacklist.list);
    }

    setDataAndRender(data) {
        Promise.resolve(this.setData(data)).then(this.render());
    }
}


