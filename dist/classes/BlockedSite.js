"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require("../constants");

var constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* --------------- --------------- --------------- --------------- --------------- */

var BlockedSite = function () {
    function BlockedSite(urlBase, title) {
        _classCallCheck(this, BlockedSite);

        this._url = this.constructUrl(urlBase);
        this._domain = urlBase;
        this._name = title;
        this._icon = this.constructIcon(urlBase);
        this._checkboxVal = true;
        this._counter = 0;
        this._timeSpent = 0;
    }

    _createClass(BlockedSite, [{
        key: "constructUrl",
        value: function constructUrl(url) {
            return "*://" + url + "/*";
        }
    }, {
        key: "constructIcon",
        value: function constructIcon(url) {
            return "<img style=\"-webkit-user-select: none\" src=\"" + constants.FAVICONLINK + url + "\">";
        }
    }, {
        key: "url",
        set: function set(url) {
            this._url = url;
        },
        get: function get() {
            return this._url;
        }
    }, {
        key: "domain",
        set: function set(domain) {
            this._domain = domain;
        },
        get: function get() {
            return this._domain;
        }
    }, {
        key: "icon",
        set: function set(icon) {
            this._icon = icon;
        },
        get: function get() {
            return this._icon;
        }
    }, {
        key: "name",
        set: function set(name) {
            this._name = name;
        },
        get: function get() {
            return this._name;
        }
    }, {
        key: "counter",
        set: function set(counter) {
            this._counter = counter;
        },
        get: function get() {
            return this._counter;
        }
    }, {
        key: "timeSpent",
        set: function set(timeSpent) {
            this._timeSpent = timeSpent;
        },
        get: function get() {
            return this._timeSpent;
        }
    }, {
        key: "checkboxVal",
        set: function set(checkboxVal) {
            this._checkboxVal = checkboxVal;
        },
        get: function get() {
            return this._checkboxVal;
        }

        /* --------------- --------------- Serialization --------------- --------------- */

    }], [{
        key: "serializeBlockedSite",
        value: function serializeBlockedSite(blockedSite) {
            // let obj = {
            //     url: blockedSite.url,
            //     domain: blockedSite.domain,
            //     name: blockedSite.name,
            //     icon: blockedSite.icon,
            //     checkboxVal: blockedSite.checkboxVal,
            //     counter: blockedSite.counter,
            //     timeSpent: blockedSite.timeSpent
            // };
            return JSON.stringify(blockedSite); //TODO check if this works
        }
    }, {
        key: "parseBlockedSite",
        value: function parseBlockedSite(blockedSite) {
            var b = new BlockedSite();
            b.url = blockedSite._url;
            b.domain = blockedSite._domain;
            b.name = blockedSite._name;
            b.icon = blockedSite._icon;
            b.checkboxVal = blockedSite._checkboxVal;
            b.counter = blockedSite._counter;
            b.timeSpent = blockedSite._timeSpent;
            return b;
        }
    }, {
        key: "deserializeBlockedSite",
        value: function deserializeBlockedSite(serializedBlockedSite) {
            if (serializedBlockedSite != null) {
                var parsed = JSON.parse(serializedBlockedSite);
                return BlockedSite.parseBlockedSite(parsed);
            }
            return null;
        }
    }]);

    return BlockedSite;
}();

exports.default = BlockedSite;