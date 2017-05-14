'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.syncBlacklist = syncBlacklist;
exports.syncSettings = syncSettings;
exports.addSiteAndSync = addSiteAndSync;

var _storage = require('../modules/storage');

var storage = _interopRequireWildcard(_storage);

var _BlockedSiteList = require('../classes/BlockedSiteList');

var _BlockedSiteList2 = _interopRequireDefault(_BlockedSiteList);

var _UserSettings = require('../classes/UserSettings');

var _UserSettings2 = _interopRequireDefault(_UserSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function syncBlacklist(blockedSiteList) {
    storage.setBlacklist(blockedSiteList);
    chrome.runtime.sendMessage({
        message: "updateListener",
        siteList: _BlockedSiteList2.default.serializeBlockedSiteList(blockedSiteList)
    });
}

function syncSettings(settings) {
    storage.setSettings(settings);
    chrome.runtime.sendMessage({
        message: "updateSettings",
        settings: _UserSettings2.default.serializeSettings(settings)
    });
}

function addSiteAndSync(blockedSiteItem) {
    storage.getBlacklist(function (blacklist) {
        if (blacklist.addToList(blockedSiteItem)) {
            syncBlacklist(blacklist);
            return true;
        } else {
            return false;
        }
    });
}