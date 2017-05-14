'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('../constants');

var constants = _interopRequireWildcard(_constants);

var _BlockedSite = require('../classes/BlockedSite');

var _BlockedSite2 = _interopRequireDefault(_BlockedSite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* --------------- --------------- --------------- --------------- --------------- */
var BlockedSiteList = function () {
    function BlockedSiteList() {
        _classCallCheck(this, BlockedSiteList);

        this._list = [];
    }

    _createClass(BlockedSiteList, [{
        key: 'addToList',
        value: function addToList(newBlockedSite) {
            var currentUrls = this.urls;
            var unique = currentUrls.every(function (urlFromList) {
                return urlFromList !== newBlockedSite.url;
            });
            if (unique) {
                this.list.push(newBlockedSite);
                return true;
            } else {
                alert(constants.newUrlNotUniqueError + newBlockedSite.domain);
                return false;
            }
        }
    }, {
        key: 'addAllToList',
        value: function addAllToList(blockedSiteList) {
            for (var i = 0; i < blockedSiteList.list.length; i++) {
                this.addToList(blockedSiteList.list[i]);
            }
        }
    }, {
        key: 'removeFromList',
        value: function removeFromList(blockedSiteToDelete) {
            var urlKey = this.list.indexOf(blockedSiteToDelete);
            if (urlKey > -1) {
                this.list.splice(urlKey, 1);
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: 'filterOnChecked',
        value: function filterOnChecked() {
            if (this.list != []) {
                return this.list.filter(function (a) {
                    return a.checkboxVal == true;
                });
            }
            return [];
        }
    }, {
        key: 'list',
        set: function set(blockedSiteArr) {
            this._list = blockedSiteArr;
        },
        get: function get() {
            return this._list;
        }
    }, {
        key: 'urls',
        get: function get() {
            if (this.list != []) {
                return this.list.map(function (bs) {
                    return bs.url;
                });
            }
            return [];
        }
    }, {
        key: 'activeUrls',
        get: function get() {
            if (this.list != []) {
                var urlList = this.filterOnChecked();
                if (urlList !== []) {
                    return urlList.map(function (bs) {
                        return bs.url;
                    });
                }
            }
            return [];
        }
    }], [{
        key: 'serializeBlockedSiteList',


        /* --------------- --------------- Serialization --------------- --------------- */

        value: function serializeBlockedSiteList(blockedSiteList) {
            var obj = {
                list: blockedSiteList.list
            };
            obj.list = obj.list.map(_BlockedSite2.default.serializeBlockedSite);
            return JSON.stringify(obj);
        }
    }, {
        key: 'parseBlockedSiteList',
        value: function parseBlockedSiteList(blockedSiteList) {
            var bl = new BlockedSiteList();
            bl.list = blockedSiteList.list;
            return bl;
        }
    }, {
        key: 'deserializeBlockedSiteList',
        value: function deserializeBlockedSiteList(serializedBlockedSiteList) {
            if (serializedBlockedSiteList != null) {
                var parsed = JSON.parse(serializedBlockedSiteList);
                parsed.list = parsed.list.map(_BlockedSite2.default.deserializeBlockedSite);
                return this.parseBlockedSiteList(parsed);
            }
            return null;
        }
    }]);

    return BlockedSiteList;
}();

exports.default = BlockedSiteList;