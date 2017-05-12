'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.serializeBlockedSiteList = serializeBlockedSiteList;
exports.parseBlockedSiteList = parseBlockedSiteList;
exports.deserializeBlockedSiteList = deserializeBlockedSiteList;

var _constants = require('../constants');

var constants = _interopRequireWildcard(_constants);

var _BlockedSite = require('../classes/BlockedSite');

var BlockedSite = _interopRequireWildcard(_BlockedSite);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* --------------- --------------- Serialization --------------- --------------- */

//Private to this and storage.js
function serializeBlockedSiteList(blockedSiteList) {
    var obj = {
        list: blockedSiteList.list
    };
    obj.list = obj.list.map(BlockedSite.serializeBlockedSite);
    return JSON.stringify(obj);
}
//Private method
function parseBlockedSiteList(blockedSiteList) {
    var bl = new BlockedSiteList();
    bl.list = blockedSiteList.list;
    return bl;
}
//Private to this and storage.js
function deserializeBlockedSiteList(serializedBlockedSiteList) {
    if (serializedBlockedSiteList !== null) {
        var parsed = JSON.parse(serializedBlockedSiteList);
        parsed.list = parsed.list.map(BlockedSite.deserializeBlockedSite);
        return parseBlockedSiteList(parsed);
    }
    return null;
}
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
                list.push(newBlockedSite);
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
            var urlKey = list.indexOf(blockedSiteToDelete);
            if (urlKey > -1) {
                list.splice(urlKey, 1);
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: 'filterOnChecked',
        value: function filterOnChecked() {
            if (list !== []) {
                return list.filter(function (a) {
                    return a.checkboxVal === true;
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
            if (list !== []) {
                return list.map(function (bs) {
                    return bs.url();
                });
            }
            return [];
        }
    }, {
        key: 'activeUrls',
        get: function get() {
            if (list !== []) {
                var urlList = this.filterOnChecked();
                if (urlList !== []) {
                    return urlList.map(function (bs) {
                        return bs.url();
                    });
                }
            }
            return [];
        }
    }]);

    return BlockedSiteList;
}();

exports.default = BlockedSiteList;