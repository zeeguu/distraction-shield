
/**
 * Table which is used to display the total amount of times the user has been intercepted in the past
 * day, week and month.
 */
export default class InterceptionCounterTable {
    constructor() {
        this._counters = null;

        this._html_countDay = $('#countDay');
        this._html_countWeek = $('#countWeek');
        this._html_countMonth = $('#countMonth');
        this._html_countTotal = $('#countTotal');
    }

    /**
     * Sets the data which is presented to the user.
     * @param data the data received from the statistics.js code.
     */
    setData(data) {
        this._counters = data;
    }

    /**
     * This function renders the data to the screen in the correct format.
     */
    render() {
        this._html_countDay.text(this._counters.countDay);
        this._html_countWeek.text(this._counters.countWeek);
        this._html_countMonth.text(this._counters.countMonth);
        this._html_countTotal.text(this._counters.countTotal);
    }

    /**
     * This functions wraps the functions setData and render in one function.
     * @param data the data received from the statistics.js page.
     */
    setDataAndRender(data) {
        Promise.resolve(this.setData(data)).then(this.render());
    }
}





