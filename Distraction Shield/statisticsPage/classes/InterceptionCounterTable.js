import BasicTable from "./BasicTable"

/**
 * Table which is used to display the total amount of times the user has been intercepted in the past
 * day, week and month.
 */
export default class InterceptionCounterTable extends BasicTable {

    /**
     * This function renders the data to the screen in the correct format.
     */
    render() {
        $('#countDay').text(this._data.countDay);
        $('#countWeek').text(this._data.countWeek);
        $('#countMonth').text(this._data.countMonth);
        $('#countTotal').text(this._data.countTotal);
    }
}





