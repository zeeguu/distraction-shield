'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//import * as $ from "../../dependencies/jquery/jquery-1.10.2";

var InterceptionCounterTable = function () {
    function InterceptionCounterTable() {
        _classCallCheck(this, InterceptionCounterTable);

        this._counters = null;

        this._html_countDay = $('#countDay');
        this._html_countWeek = $('#countWeek');
        this._html_countMonth = $('#countMonth');
        this._html_countTotal = $('#countTotal');
    }

    _createClass(InterceptionCounterTable, [{
        key: 'setData',
        value: function setData(data) {
            this.counters = data;
        }
    }, {
        key: 'render',
        value: function render() {
            this._html_countDay.text(this.counters.countDay);
            this._html_countWeek.text(this.counters.countWeek);
            this._html_countMonth.text(this.counters.countMonth);
            this._html_countTotal.text(this.counters.countTotal);
        }
    }, {
        key: 'setDataAndRender',
        value: function setDataAndRender(data) {
            Promise.resolve(this.setData(data)).then(this.render());
        }
    }]);

    return InterceptionCounterTable;
}();

exports.default = InterceptionCounterTable;