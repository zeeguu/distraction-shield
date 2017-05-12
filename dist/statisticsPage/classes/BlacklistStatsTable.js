"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require("../../dependencies/jquery/jquery-1.10.2");

var $ = _interopRequireWildcard(_jquery);

var _dateutil = require("../../modules/dateutil");

var dateutil = _interopRequireWildcard(_dateutil);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BlacklistStatsTable = function () {
    function BlacklistStatsTable(html_element) {
        _classCallCheck(this, BlacklistStatsTable);

        this._table = html_element;
        this._blacklist = null;
    }

    // This has to be a function because it is called in a Promise


    _createClass(BlacklistStatsTable, [{
        key: "setData",
        value: function setData(data) {
            this._blacklist = data;
        }
    }, {
        key: "createBlockedSiteTable",
        value: function createBlockedSiteTable(siteList) {
            $.each(siteList, function (k, site) {
                this._table.append(this.generateTableRow(site));
            });
        }
    }, {
        key: "generateTableRow",
        value: function generateTableRow(site) {
            return $("<tr class='table-row' >" + "<td>" + site.icon + "</td>" + "<td>" + site.name + "</td>" + "<td>" + site.counter + "</td>" + "<td>" + dateutil.secondsToHHMMSS(site.timeSpent) + "</td>" + "</tr>");
        }
    }, {
        key: "render",
        value: function render() {
            this.createBlockedSiteTable(this._blacklist.list);
        }
    }, {
        key: "setDataAndRender",
        value: function setDataAndRender(data) {
            Promise.resolve(this.setData(data)).then(this.render());
        }
    }]);

    return BlacklistStatsTable;
}();

exports.default = BlacklistStatsTable;