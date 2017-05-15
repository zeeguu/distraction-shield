//import * as $ from "../../dependencies/jquery/jquery-1.10.2";

export default class InterceptionCounterTable{
        constructor(){
            this._counters = null;

            this._html_countDay = $('#countDay');
            this._html_countWeek = $('#countWeek');
            this._html_countMonth = $('#countMonth');
            this._html_countTotal = $('#countTotal');
        }

        setData(data) {
            this.counters = data;
        }

        render() {
            this._html_countDay.text(this.counters.countDay);
            this._html_countWeek.text(this.counters.countWeek);
            this._html_countMonth.text(this.counters.countMonth);
            this._html_countTotal.text(this.counters.countTotal);
        }

        setDataAndRender(data) {
            Promise.resolve(this.setData(data)).then(this.render());
        }
    }





